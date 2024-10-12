import React from "react";
import AjukanKarya from "../_components/AjukanKarya";
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
    where:{
      userId:session?.user?.id
    },
    include: {
      user: { include: { userAuth: true } },
      TaskValidator: true,
      comment: { include: { user: true } },
    },
  });
  if (userData) {
    if (session?.user?.email && !userData.title) return redirect("/pilihRole");
  }

  if (!session?.user?.email) return redirect("/signin");
  console.log(files);
  return <AjukanKarya userData={userData as userFullPayload} file={files} />;
}
