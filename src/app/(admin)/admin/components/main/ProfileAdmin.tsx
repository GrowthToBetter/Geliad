import { nextGetServerSession } from "@/lib/authOption";
import Image from "next/image";
import React from "react";

export default async function ProfileAdmin() {
  const session = await nextGetServerSession();
  return (
    session?.user ?
    <div className="flex gap-x-4 items-center bg-Primary py-2 px-2 pl-4 rounded-full">
      <p className="font-semibold text-[16px]">{session?.user?.name}</p>
      <Image src={session.user.image} width={40} height={40} alt="admin" className="rounded-full" />
    </div>: <></>
  );
}
