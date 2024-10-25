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
  const getGenre=await prisma.genre.findMany();
  if (userData) {
    if (session?.user?.email && !userData.title && userData?.role==="SISWA") return redirect("/pilihRole");
  }

  if (!session?.user?.email) return redirect("/signin");
  return <AjukanKarya userData={userData as userFullPayload} genre={getGenre}/>;
}
