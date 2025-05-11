"use server"
import Imap from "node-imap";
import { simpleParser } from "mailparser";
import { EmailCredentialsModel } from "@/modals/email.modal";

let imap: Imap | null = null;

async function initializeImapConnection() {
  try {
    // Get email settings from MongoDB
    const emailSettings = await EmailCredentialsModel.find().lean();

    if (!emailSettings) {
      throw new Error("No email settings found in database");
    }

    // Create IMAP config with database credentials
    const imapConfig = {
      user: emailSettings[0].EMAIL_SERVER_USER,
      password: emailSettings[0].EMAIL_SERVER_PASSWORD,
      host: "imap.gmail.com",
      port: 993,
      tls: true,
      tlsOptions: {
        rejectUnauthorized: false,
        timeout: 20000,
      },
      authTimeout: 30000,
    };

    // Create new IMAP instance
    imap = new Imap(imapConfig);
    console.log("DB IMAP connection initialized successfully");

    return imap;
  } catch (error) {
    console.error("Failed to initialize IMAP connection from DB:", error);
    // Fallback to environment variables if database connection fails
    return new Imap({
      user: process.env.EMAIL_SERVER_USER,
      password: process.env.EMAIL_SERVER_PASSWORD,
      host: "imap.gmail.com",
      port: 993,
      tls: true,
      tlsOptions: {
        rejectUnauthorized: false,
        timeout: 20000,
      },
      authTimeout: 30000,
    });
  }
}

// Function to process email
async function processEmail(email) {
  try {
    const emailProcessed = {
      email: email.from.value.map((v) => v.address).join(", "),
      name: email.from.value.map((v) => v.name).join(", "),
      to: email.to.value.map((v) => v.address).join(", "),
      subject: email.subject,
      text: email.text,
      date: email.date,
      id: email.messageId,
      read: false,
      labels: ["meeting", "work", "important"],
    };
    return emailProcessed;
  } catch (error) {
    console.error("Error processing email:", error);
    throw error;
  }
}

async function fetchUnseenEmails() {
  return new Promise(async (resolve, reject) => {
    try {
      // Initialize IMAP connection if not exists
      if (!imap) {
        imap = await initializeImapConnection();
      }

      imap.once("ready", () => {
        console.log("IMAP connection ready");

        imap.openBox("INBOX", false, (err, box) => {
          if (err) {
            console.error("Error opening inbox:", err);
            reject(err);
            return;
          }

          console.log("Inbox opened successfully");

          imap.search(
            ["UNSEEN", ["X-GM-RAW", "category:primary"]],
            (err, results) => {
              if (err) {
                console.error("Error searching emails:", err);
                reject(err);
                return;
              }

              if (results.length === 0) {
                console.log("No unseen emails found in the Primary folder");
                resolve([]);
                return;
              }

              console.log(`${results.length} unseen emails found`);

              const fetch = imap.fetch(results, { bodies: "", struct: true });
              const emailPromises = [];

              fetch.on("message", (msg) => {
                const emailPromise = new Promise((res, rej) => {
                  msg.on("body", (stream) => {
                    simpleParser(stream, (err, parsed) => {
                      if (err) {
                        console.error("Error parsing email:", err);
                        rej(err);
                      } else {
                        processEmail(parsed).then(res).catch(rej);
                      }
                    });
                  });
                });

                emailPromises.push(emailPromise);
              });

              fetch.on("end", async () => {
                console.log("Fetch completed");
                try {
                  const emails = await Promise.all(emailPromises);
                  resolve(emails);
                } catch (err) {
                  console.error("Error processing emails:", err);
                  reject(err);
                }
              });

              fetch.on("error", (err) => {
                console.error("Error fetching emails:", err);
                reject(err);
              });
            }
          );
        });
      });

      imap.once("error", (err) => {
        console.error("IMAP error:", err);
        reject(err);
      });

      imap.once("end", () => {
        console.log("IMAP connection ended");
      });

      imap.connect((err) => {
        if (err) {
          console.error("Connection error:", err);
          reject(err);
        }
      });
    } catch (error) {
      console.error("Error in fetchUnseenEmails:", error);
      reject(error);
    }
  });
}

// Create an API route to fetch unseen emails
export default async function FetchEmails() {
  try {
    const emails = await fetchUnseenEmails();
    return emails;
  } catch (error) {
    console.error("API route error:", error);
  }
}
