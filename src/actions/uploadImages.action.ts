// "use server";
// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
// const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
// const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
// const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;

// const s3Client = new S3Client({
//   region: 'auto',
//   endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
//   credentials: {
//     accessKeyId: R2_ACCESS_KEY_ID!,
//     secretAccessKey: R2_SECRET_ACCESS_KEY!,
//   },
// });

// export async function uploadImages(base64Images: string[], userId: string, characterName: string) {
//   const uploadPromises = base64Images.map(async (base64Image, index) => {
//     // Extract the content type and base64 data
//     const matches = base64Image.match(/^data:(.*?);base64,(.*)$/);
//     if (!matches) {
//       throw new Error('Invalid base64 string');
//     }

//     const contentType = matches[1];
//     const base64Data = matches[2];

//     // Determine file extension from content type
//     const fileExtension = contentType.split('/').pop();
//     const key = `users/${userId}/${characterName}/trainImgs/${Date.now()}-${index}.${fileExtension}`;

//     // Convert base64 to buffer
//     const buffer = Buffer.from(base64Data, 'base64');

//     const command = new PutObjectCommand({
//       Bucket: R2_BUCKET_NAME,
//       Key: key,
//       Body: buffer,
//       ContentType: contentType,
//       ContentLength: buffer.length, // Provide Content-Length
//     });

//     await s3Client.send(command);
//     return `https://r2.nomapos.com/${key}`;
//   });

//   return Promise.all(uploadPromises);
// }

"use server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import pLimit from "p-limit";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID!,
    secretAccessKey: R2_SECRET_ACCESS_KEY!,
  },
});

const limit = pLimit(10); // Limit concurrent uploads

async function uploadSingleImage(
  base64Image: string,
  userId: string,
  characterName: string,
  index: number
) {
  const matches = base64Image.match(/^data:(.*?);base64,(.*)$/);
  if (!matches) {
    throw new Error("Invalid base64 string");
  }

  const contentType = matches[1];
  const base64Data = matches[2];

  const fileExtension = contentType.split("/").pop();
  const key = `users/${userId}/${characterName}/trainImgs/${Date.now()}-${index}.${fileExtension}`;

  const buffer = Buffer.from(base64Data, "base64");

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    ContentLength: buffer.length,
  });

  await s3Client.send(command);
  return `https://r2.nomapos.com/${key}`;
}

export async function uploadImages(
  base64Images: string[],
  userId: string,
  characterName: string
) {
  const uploadPromises = base64Images.map((base64Image, index) =>
    limit(() => uploadSingleImage(base64Image, userId, characterName, index))
  );

  return Promise.all(uploadPromises);
}
