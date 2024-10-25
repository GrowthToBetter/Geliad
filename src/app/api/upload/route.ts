/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { drive_v3 } from "googleapis/build/src/apis/drive/v3";
import { Readable } from "stream";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createFile } from "@/utils/server-action/userGetServerSession";
import { userFullPayload } from "@/utils/relationsip";

const credentials = {
  type: process.env.GOOGLE_ACCOUNT_TYPE,
  project_id: process.env.GOOGLE_PROJECT_ID,
  private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_PRIVATE_KEY,
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_CLIENT_ID_DRIVE,
  auth_uri: process.env.GOOGLE_AUTH_URI,
  token_uri: process.env.GOOGLE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
} as any;

const auth = new google.auth.GoogleAuth({
  projectId: process.env.GOOGLE_PROJECT_ID,
  universeDomain: process.env.GOOGLE_UNIVERSE_DOMAIN,
  credentials,
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});

const drive: drive_v3.Drive = google.drive({ version: "v3", auth });

export async function POST(req: NextRequest) {
  try {
    console.log("Starting file upload process");
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    console.log("Received file:", file?.name, "Size:", file?.size);
    console.log("User ID:", userId);

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("User found:", user.id);

    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    if (!folderId) {
      throw new Error("GOOGLE_DRIVE_FOLDER_ID is not defined");
    }

    console.log("Google Drive Folder ID:", folderId);

    const fileMetadata: drive_v3.Schema$File = {
      name: file.name,
      parents: [folderId],
    };

    const media = {
      mimeType: file.type,
      body: Readable.from(Buffer.from(await file.arrayBuffer())),
    };
    console.log("Uploading file to Google Drive");

    const driveResponse = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id, webViewLink",
    });

    if (!driveResponse.data || !driveResponse.data.id) {
      throw new Error("Failed to upload file to Google Drive");
    }

    console.log("File uploaded to Google Drive:", driveResponse.data.id);

    await drive.permissions.create({
      fileId: driveResponse.data.id,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    console.log("File permissions set");
    const uploadedFile:any = await createFile(
      file,
      driveResponse,
      user as userFullPayload,
      formData,
      drive
    );
    console.log("File record created in database:", uploadedFile.id);

    revalidatePath("/AjukanKarya");
    return NextResponse.json(uploadedFile);
  } catch (error) {
    console.error("Error handling upload:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return NextResponse.json(
      {
        error: "Failed uploading file",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
