import React from "react";
import AdminHeaders from "../components/main/AdminHeaders";
import prisma from "@/lib/prisma";
import Table from "../studentData/_components/TableGenre";
import { userFullPayload } from "@/utils/relationsip";
import { nextGetServerSession } from "@/lib/authOption";

export default async function teamData() {
  const dataCategory = await prisma.genre.findMany();
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
  return (
    <>
      <AdminHeaders data="Data Category" />
      <Table userData={userData as userFullPayload} dataGenre={dataCategory} />
    </>
  );
}
