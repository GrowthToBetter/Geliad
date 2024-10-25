import React from "react";
import DetailProfilePartner from "./_components/DetailProfilePartner";
import { nextGetServerSession } from "@/lib/authOption";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function profilePartner({ params }: { params: { id: string } }) {
  const session = await nextGetServerSession();
  if (!session?.user?.email) {
    return redirect("signin");
  }
  const findUser = await prisma.user.findFirst({
    where: { id: params.id },
    include: { userAuth: true, File: { include: { TaskValidator: true } }, taskValidator: { include: { user: true } }, comment: { include: { file: true } } },
  });
  return <DetailProfilePartner userId={params.id} userData={findUser!} />;
}
