import { findAllUsers } from "@/utils/user.query";
import { NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: Request) {
  const dataUser = await findAllUsers();
  return new NextResponse(JSON.stringify({ dataUser }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
