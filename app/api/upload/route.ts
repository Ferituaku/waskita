// import { NextRequest, NextResponse } from "next/server";
// import { writeFile, mkdir } from "fs/promises";
// import { join } from "path";
// import { existsSync } from "fs";

// export async function POST(request: NextRequest) {
//   try {
//     const formData = await request.formData();
//     const file = formData.get("file") as File;
//     const type = formData.get("type") as string; // "image" or "pdf"

//     if (!file) {
//       return NextResponse.json(
//         { success: false, error: "No file uploaded" },
//         { status: 400 }
//       );
//     }

//     // Validasi tipe file
//     const allowedTypes = type === "image"
//       ? ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"]
//       : ["application/pdf"];

//     if (!allowedTypes.includes(file.type)) {
//       return NextResponse.json(
//         { success: false, error: "Invalid file type" },
//         { status: 400 }
//       );
//     }

//     // Convert file to buffer
//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);

//     // Buat nama file unik
//     const timestamp = Date.now();
//     const originalName = file.name.replace(/\s/g, "-");
//     const fileName = `${timestamp}-${originalName}`;

//     // Tentukan folder berdasarkan tipe
//     const folder = type === "image" ? "images" : "documents";
//     const uploadDir = join(process.cwd(), "public", "uploads", folder);

//     // Buat folder jika belum ada
//     if (!existsSync(uploadDir)) {
//       await mkdir(uploadDir, { recursive: true });
//     }

//     // Simpan file
//     const filePath = join(uploadDir, fileName);
//     await writeFile(filePath, buffer);

//     // Return URL path
//     const fileUrl = `/uploads/${folder}/${fileName}`;

//     return NextResponse.json({
//       success: true,
//       url: fileUrl,
//       fileName: fileName,
//     });
//   } catch (error) {
//     console.error("Error uploading file:", error);
//     return NextResponse.json(
//       { success: false, error: "Failed to upload file" },
//       { status: 500 }
//     );
//   }
// }

// app/api/upload/image/route.ts
import { NextRequest, NextResponse } from "next/server";
import { uploadToR2 } from "@/lib/r2-storage";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }

    // Upload to R2
    const imageUrl = await uploadToR2(file, "articles");

    return NextResponse.json({
      success: true,
      data: { imageUrl },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, message: "Upload failed" },
      { status: 500 }
    );
  }
}
