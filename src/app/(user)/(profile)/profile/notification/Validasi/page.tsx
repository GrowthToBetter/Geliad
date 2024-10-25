/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import Home from "../../_components/Validasi";
import prisma from "@/lib/prisma";
import { nextGetServerSession } from "@/lib/authOption";
import { redirect } from "next/navigation";
import { FileFullPayload, userFullPayload } from "@/utils/relationsip";

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
  let file:FileFullPayload[]=[];
  if (session?.user?.role==="SISWA") {
     file = await prisma.fileWork.findMany({
      where: {
        userId: session?.user?.id,
      },
      include: {
        user: { include: { userAuth: true } },
        TaskValidator: true,
        comment: { include: { user: true } },
      },
    });
  } else{
    file = await prisma.fileWork.findMany({
      include: {
        user: { include: { userAuth: true } },
        TaskValidator: true,
        comment: { include: { user: true } },
      },
    });
  }
  if (userData) {
    if (session?.user?.email && !userData.title && userData.role==="SISWA") return redirect("/pilihRole");
  }
  return <Home userData={userData as userFullPayload} file={file} />;
}
