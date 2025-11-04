import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const R2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToR2(
  file: File,
  folder: string = "articles"
): Promise<string> {
  const timestamp = Date.now();
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "-");
  const fileName = `${timestamp}-${sanitizedName}`;
  const key = `${folder}/${fileName}`;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  await R2.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    })
  );

  const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;
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
