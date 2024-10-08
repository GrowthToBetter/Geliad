// pages/api/getFiles.js
import { findFiles } from '@/utils/user.query';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("fileId");

  try {
    let dataFile;
    if (!userId) {
      dataFile = await findFiles({});
    } else {
      dataFile = await findFiles({userId});
    }

    if (!dataFile) {
      return new NextResponse(JSON.stringify({ error: "No files found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new NextResponse(JSON.stringify({ dataFile }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching files:", error);
    return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}