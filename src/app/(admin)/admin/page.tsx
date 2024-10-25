import React from "react";
import AdminHeaders from "./components/main/AdminHeaders";
import { findAllUsers, findFiles } from "@/utils/user.query";
import prisma from "@/lib/prisma";
import TableUser from "./components/main/TableUser";
import { nextGetServerSession } from "@/lib/authOption";
import { userFullPayload } from "@/utils/relationsip";

interface cardProps {
  title: string;
  data: number | string;
  desc: string;
}


export default async function AdminPage() {
  const dataUser = await findAllUsers({
    AND: [{ NOT: { role: "ADMIN" } }, { NOT: { role: "GURU" } }],
  });
  const dataPaper = await findFiles({
    AND: [{ NOT: { status: "DENIED" } }, { NOT: { status: "PENDING" } }],
  });
  const dataAdmin = await prisma.user.findMany({
    where: {
      AND: [{ NOT: { role: "SISWA" } }, { NOT: { role: "GURU" } }],
    },
    include: { userAuth: true },
  });
  const dataSubmited = await findFiles({
    AND: [{ NOT: { status: "DENIED" } }, { NOT: { status: "VERIFIED" } }],
  })

  const CardItem: cardProps[] = [
    {
      title: "Number of user",
      data: dataUser.length,
      desc: "user who allocated they paper",
    },
    {
      title: "Number of Mentor",
      data: dataPaper.length,
      desc: "All Verified Paper",
    },
    {
      title: "Number of works submitted",
      data: dataSubmited.length,
      desc: "Malang Telkom Vocational School Achievements",
    },
  ];
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
    <div className="flex flex-col relative">
      <section className="w-full">
        <AdminHeaders data="Dashboard" />
        <section className="max-w-[1440px] ml-[20px] p-4 outline outline-1 outline-slate-200 mx-auto w-full bg-[#F6F6F6]">
          <h5 className="text-[24px] font-semibold text-Secondary">Statistik Data</h5>
          <div className="grid grid-cols-4 p-4 gap-x-4">
            {CardItem.map((x, i) => (
              <div key={i} className="p-6 bg-white drop-shadow rounded-[12px]">
                <p className="text-[16px] font-normal">{x.title}</p>
                <div className="mt-6">
                  <h6 className="text-[40px] font-medium text-Secondary">{x.data}</h6>
                  <p className="text-[14px] font-normal">{x.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
      <TableUser userData={userData as userFullPayload} dataAdmin={dataAdmin} />
    </div>
  );
}
