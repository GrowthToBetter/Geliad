import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import path from "path";
import { writeFile } from "fs/promises";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create unique filename
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    const uniqueId = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    
    const originalName = file.name;
    const extension = path.extname(originalName);
    const filename = `${uniqueId}${extension}`;
    
    // Save file
    const bytes_file = await file.arrayBuffer();
    const buffer = Buffer.from(bytes_file);
    
    const uploadDir = path.join(process.cwd(), "public/uploads");
    const filepath = path.join(uploadDir, filename);
    
    await writeFile(filepath, buffer);

    // Save to database
    const uploadedFile = await prisma.fileWork.create({
      data: {
        filename: originalName,
        mimetype: file.type,
        size: file.size,
        path: `/uploads/${filename}`,
        userId: userId,
        status: "PENDING",
      },
    });

    return NextResponse.json(uploadedFile);
  } catch (error) {
    console.error("Error handling upload:", error);
    return NextResponse.json(
      { error: "Failed uploading file", details: String(error) },
      { status: 500 }
    );
  }
}
