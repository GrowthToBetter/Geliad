/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { userFullPayload } from "@/utils/relationsip";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page(props: { params: { slug: string } }) {
  const [userData, setUserData] = useState<userFullPayload | null>(null);
  const [modal, setModal] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    const fetchUserData = async () => {
      if (props.params.slug) {
        try {
          const response = await fetch(`/api/user?userId=${props.params.slug}`);
          if (response.ok) {
            const { user } = await response.json();
            setUserData(user);
          } else {
            throw new Error("Failed to fetch user data");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [props]);
  const handleModal = () => {
    setModal(!modal);
  };
  if(userData){
    if(status==="authenticated" && !userData.title && userData.role==="SISWA") return router.push("/pilihRole");
  }
  return (
    <div className="bg-slate-100 p-5 md:p-10 lg:p-15 xl:p-20">
      <div className="mt-24 bg-white rounded-3xl p-10 md:p-15 lg:p-20 xl:p-24 relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-start mt-28 md:mt-32 lg:mt-36 xl:mt-40">
          <div className="w-32 h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full bg-gray-300 mb-4 overflow-hidden">
            <Image
              src={userData?.photo_profile || "https://via.placeholder.com/150"}
              alt="Profile"
              width={200}
              height={200}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mt-4 flex w-full justify-between">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-normal">
              {userData?.name}
              {userData?.clasess ? ` (${userData?.clasess})` : ""}
            </h1>
            <div className="flex gap-x-2">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleModal}
              >
                Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
