// app/api/upload/image/route.ts

import { NextRequest, NextResponse } from "next/server";
import { uploadToR2 } from "@/lib/r2-storage";

// Configuration
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    console.log("📤 Upload request received:", {
      hasFile: !!file,
      filename: file?.name,
      size: file?.size,
      type: file?.type,
    });

    // Validate: File exists
    if (!file) {
      console.error("❌ No file in request");
      return NextResponse.json(
        {
          success: false,
          message: "No file uploaded",
        },
        { status: 400 }
      );
    }

    // Validate: File type
    if (!ALLOWED_TYPES.includes(file.type)) {
      console.error("❌ Invalid file type:", file.type);
      return NextResponse.json(
        {
          success: false,
          message: `Invalid file type. Allowed: JPG, PNG, GIF, WebP`,
        },
        { status: 400 }
      );
    }

    // Validate: File size
    if (file.size > MAX_FILE_SIZE) {
      console.error("❌ File too large:", file.size);
      return NextResponse.json(
        {
          success: false,
          message: `File too large. Maximum size is 5MB`,
        },
        { status: 400 }
      );
    }

    console.log("✅ Validation passed, uploading to R2...");

    // ⭐ Upload to Cloudflare R2
    const imageUrl = await uploadToR2(file, "articles");

    console.log("✅ Upload successful:", imageUrl);

    // ⭐ CRITICAL: Return imageUrl in data.imageUrl
    return NextResponse.json({
      success: true,
      message: "File uploaded successfully",
      data: {
        imageUrl,  // ⭐ This is the R2 URL
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      },
    });
  } catch (error) {
    console.error("❌ Upload error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Upload failed",
        error: error instanceof Error ? error.stack : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS (if needed)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

// Disable body parsing (Next.js 13+ handles this automatically)
export const config = {
  api: {
    bodyParser: false,
  },
};