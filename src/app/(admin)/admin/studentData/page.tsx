import React from "react";
import AdminHeaders from "../components/main/AdminHeaders";
import Table from "./_components/Table";
import prisma from "@/lib/prisma";

export default async function studentData() {
  const studentData = await prisma.user.findMany({
    where: { role: "SISWA" },
    include: { userAuth: true },
  });

  return (
    <div className="flex flex-col">
      <AdminHeaders data="Student Data" />
      <Table studentData={studentData} />
    </div>
  );
}
