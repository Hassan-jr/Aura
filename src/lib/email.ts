import nodemailer from "nodemailer";
import User from "@/modals/user.modal";
import { Product } from "@/modals/product.modal";
import { Discount } from "@/modals/discount.modal";
import { EmailCredentialsModel } from "@/modals/email.modal";


let transporter: nodemailer.Transporter | null = null;

async function initializeEmailTransporter() {
  try {
    // Get the active email settings from MongoDB
    const emailSettings = await EmailCredentialsModel.find().lean();
    // console.log("Email Settings:",emailSettings );
    
    
    if (!emailSettings) {
      throw new Error("No active email settings found in database");
    }

    // Create the transporter with database credentials
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: process.env.EMAIL_SERVER_PORT,
      auth: {
        user: emailSettings[0].EMAIL_SERVER_USER,
        pass: emailSettings[0].EMAIL_SERVER_PASSWORD
      }
    });

    // Verify the connection
    await transporter.verify();
    console.log("DB Email transporter initialized successfully");
    
    return transporter;
  } catch (error) {
    console.error("Failed to initialize email transporter:", error);
    // Fallback to environment variables if database connection fails
    return nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: process.env.EMAIL_SERVER_PORT,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      }
    });
  }
}

export async function sendVerificationEmail(to: string, token: string) {
  if (!transporter) {
    await initializeEmailTransporter();
  }
  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: "Verify your email address | Inprime AI",
    html: `
      <p>Please click the link below to verify your email address:</p>
      <p><a href="${verificationUrl}">${verificationUrl}</a></p>
    `,
  });
}

export async function sendDiscountEmail(
  userId: string,
  discountRate: Number,
  productId: string,
  expiryDate: Date
) {
  if (!transporter) {
    await initializeEmailTransporter();
  }
  const user = await User.findById(userId);

  const product = await Product.findById(productId);

  const userName = user.name;
  const productTitle = product.title;
  const productLink = "";

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: `Hello ${user.name}! You Got a ${discountRate}% discount on ${product.title}`,
    html: `
     <!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border: 1px solid #dddddd;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: #0073e6;
      color: #ffffff;
      padding: 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 20px;
      color: #333333;
      text-align: center;
    }
    .content h2 {
      margin-top: 0;
      font-size: 20px;
    }
    .cta-button {
      display: inline-block;
      margin: 20px auto;
      padding: 10px 20px;
      color: #ffffff;
      background-color: #0073e6;
      text-decoration: none;
      font-size: 16px;
      border-radius: 5px;
    }
    .footer {
      background-color: #f4f4f4;
      color: #888888;
      padding: 10px;
      text-align: center;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>🎉 Exclusive Discount Just for You! 🎉</h1>
    </div>
    <div class="content">
      <h2>Hello, ${userName}!</h2>
      <p>We’re excited to offer you a special discount of <strong>${discountRate}%</strong> on our product: <strong>${productTitle}</strong>.</p>
      <p>Don’t miss this chance to save big on your favorite items!</p>
      <a href="${productLink}" class="cta-button">Claim Your Discount</a>
      <p>Hurry! This offer expires on <strong>${expiryDate}</strong>.</p>
    </div>
    <div class="footer">
      <p>If you have any questions, feel free to contact us at abdi_ladif@students.uonbi.ac.ke.</p>
      <p>Thank you for being a valued customer!</p>
    </div>
  </div>
</body>
</html>

    `,
  });
}

export async function sendInvoiceEmail(
  userId: string,
  productId: string,
  expiryDate: Date,
  qty: number
) {
  if (!transporter) {
    await initializeEmailTransporter();
  }
  const currentDate = new Date();

  const user = await User.findById(userId);
  const product = await Product.findById(productId);
  const discount = await Discount.findOne({
    userId,
    productId,
    expiryDate: { $gt: currentDate },
  });

  const userName = user.name;
  const productTitle = product.title;
  const productLink = "";
  const discountRate = discount ? discount.agreedDiscountRate : 0;

  const pricePerPiece = ((100 - discountRate) / 100) * product.price;
  const totalPrice = pricePerPiece * qty;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: `Hello ${userName}! Your Invoice for ${productTitle} is Ready.`,
    html: `
    <!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f9f9f9;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
    }
    .header {
      background-color: #4caf50;
      color: #ffffff;
      text-align: center;
      padding: 20px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 20px;
      color: #333333;
    }
    .content h2 {
      margin-top: 0;
      font-size: 20px;
    }
    .details-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    .details-table th, .details-table td {
      border: 1px solid #dddddd;
      padding: 10px;
      text-align: left;
    }
    .details-table th {
      background-color: #f4f4f4;
    }
    .cta-button {
      display: inline-block;
      margin: 20px auto;
      padding: 10px 20px;
      background-color: #4caf50;
      color: #ffffff;
      text-decoration: none;
      font-size: 16px;
      border-radius: 5px;
      text-align: center;
    }
    .footer {
      background-color: #f4f4f4;
      text-align: center;
      padding: 10px;
      font-size: 12px;
      color: #888888;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Invoice for ${productTitle} </h1>
    </div>
    <div class="content">
      <h2>Hello, ${userName}!</h2>
      <p>Thank you for your purchase. Below are the details of your order:</p>
      <table class="details-table">
        <tr>
          <th>Product</th>
          <td>${productTitle}</td>
        </tr>
        <tr>
          <th>Quantity</th>
          <td>${qty}</td>
        </tr>
        <tr>
          <th>Discount</th>
          <td>${discountRate}%</td>
        </tr>
        <tr>
          <th>Total Price</th>
          <td>${totalPrice}</td>
        </tr>
        <tr>
          <th>Expiration Date</th>
          <td>${expiryDate}</td>
        </tr>
      </table>
      <p>You can view more details or manage your purchase using the link below:</p>
      <a href="${productLink}" class="cta-button">Purchase The Invoice</a>
    </div>
    <div class="footer">
      <p>If you have any questions, feel free to contact us at abdi_ladif@students.uonbi.ac.ke </p>
      <p>Thank you for shopping with us!</p>
    </div>
  </div>
</body>
</html>

    
    `,
  });
}
