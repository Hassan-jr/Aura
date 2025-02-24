import Imap from "node-imap";
import { simpleParser } from "mailparser";
import { NextResponse } from "next/server";

// Email configuration - Corrected for Gmail IMAP
const imapConfig = {
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
};

// Create IMAP instance
const imap = new Imap(imapConfig);

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

// Function to fetch unseen emails from the Primary folder
// function fetchUnseenEmails() {
//   return new Promise((resolve, reject) => {
//     imap.once("ready", () => {
//       console.log("IMAP connection ready");

//       // Open the INBOX folder
//       imap.openBox("INBOX", false, (err, box) => {
//         if (err) {
//           console.error("Error opening inbox:", err);
//           reject(err);
//           return;
//         }

//         console.log("Inbox opened successfully");

//         // Search for unseen emails with the Gmail label `CATEGORY_PERSONAL` (Primary folder)
//         imap.search(
//           ["UNSEEN", ["X-GM-RAW", "category:primary"]],
//           (err, results) => {
//             if (err) {
//               console.error("Error searching emails:", err);
//               reject(err);
//               return;
//             }

//             if (results.length === 0) {
//               console.log("No unseen emails found in the Primary folder");
//               resolve([]);
//               return;
//             }

//             console.log(`${results.length} unseen emails found`);

//             const fetch = imap.fetch(results, {
//               bodies: "",
//               struct: true,
//             });

//             const emails = [];

//             fetch.on("message", (msg) => {
//               msg.on("body", (stream) => {
//                 simpleParser(stream, async (err, parsed) => {
//                   if (err) {
//                     console.error("Error parsing email:", err);
//                     reject(err);
//                     return;
//                   }

//                   try {
//                     const processedEmail = await processEmail(parsed);
//                     emails.push(processedEmail);
//                   } catch (error) {
//                     reject(error);
//                   }
//                 });
//               });
//             });

//             fetch.on("end", () => {
//               console.log("Fetch completed");
//               resolve(emails);
//             });

//             fetch.on("error", (err) => {
//               console.error("Error fetching emails:", err);
//               reject(err);
//             });
//           }
//         );
//       });
//     });

//     imap.once("error", (err) => {
//       console.error("IMAP error:", err);
//       reject(err);
//     });

//     imap.once("end", () => {
//       console.log("IMAP connection ended");
//     });

//     imap.connect((err) => {
//       if (err) {
//         console.error("Connection error:", err);
//         reject(err);
//       }
//     });
//   });
// }

function fetchUnseenEmails() {
  return new Promise((resolve, reject) => {
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
  });
}

// Create an API route to fetch unseen emails
export async function POST(req: Request) {
  try {
    const emails = await fetchUnseenEmails();
    return NextResponse.json({
      message: "Fetched unseen emails successfully",
      data: emails,
    });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch unseen emails",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
