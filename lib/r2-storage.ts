import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const R2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT!, // https://xxx.r2.cloudflarestorage.com
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToR2(
  file: File,
  folder: string = "articles"
): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileName = `${folder}/${Date.now()}-${file.name}`;

  await R2.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    })
  );

  // Return public URL
  const publicUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`;
  return publicUrl;
}

export async function deleteFromR2(fileKey: string): Promise<void> {
  await R2.send(
    new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: fileKey,
    })
  );
}