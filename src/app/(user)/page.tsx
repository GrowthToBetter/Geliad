import React from "react";
import Home from "./_components/Home";
import prisma from "@/lib/prisma";
import { nextGetServerSession } from "@/lib/authOption";
import { redirect } from "next/navigation";
import { userFullPayload } from "@/utils/relationsip";

export default async function page() {
  const session = await nextGetServerSession();
  const userData = await prisma.user.findFirst({
    where: {
      id: session?.user?.id,
    },
    include: {
      userAuth: true,
      File: { include: { TaskValidator: true } },
      taskValidator: { include: { user: true } },
      comment: { include: { file: true } },
    },
  });
  const files = await prisma.fileWork.findMany({
    include: {
      user: { include: { userAuth: true } },
      TaskValidator: true,
      comment: { include: { user: true } },
    },
  });
  if (userData) {
    if (session?.user?.email && !userData.title) return redirect("/pilihRole");
  }
  return <Home userData={userData as userFullPayload} files={files} />;
}
