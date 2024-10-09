/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { FormButton, LinkButton } from "@/app/components/utils/Button";
import FileUploader from "./_components/UploaderFile/page";
import { useEffect, useState } from "react";
import { FileFullPayload, userFullPayload } from "@/utils/relationsip";
import { signOut, useSession } from "next-auth/react";
import ModalProfile from "@/app/components/utils/Modal";
import useSWR from "swr";
import { fetcher } from "@/utils/server-action/Fetcher";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RequestStatus } from "@prisma/client";
import { updateStatus } from "@/utils/server-action/userGetServerSession";
import toast from "react-hot-toast";

const UploadPage: React.FC = () => {
  const [modal, setModal] = useState(false);
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<userFullPayload | null>(null);
  const [openProfiles, setOpenProfiles] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [file, setFile] = useState<FileFullPayload[]>([]);
  const router = useRouter();
  useEffect(() => {
    const fetchUserData = async () => {
      if (session) {
        try {
          const response = await fetch(`/api/user?userId=${session.user?.id}`);
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
  }, [session]);
  const { data, error } = useSWR(`/api/getFiles${userData?.role==="SISWA" ? `?fileId=${userData?.id}`: ""}`, fetcher, {
    refreshInterval: 1000,
  });
  useEffect(() => {
    if (data) {
      const { dataFile } = data;
      setFile(dataFile);
    }
  }, [data]);
  const handleProf = (id: string) => {
    setOpenProfiles((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  const handleClick= async (id:string)=>{
    try {
      const loading=toast.loading("Loading...");
      const formData = new FormData();
      formData.set("status", "VERIFIED" as RequestStatus);
      await updateStatus(id, formData)
      toast.success("Success", {id:loading});
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
  return (
    <div className="pt-44">
      <>
        <div className="flex justify-center items-center w-screen h-fit">
          <div className="shadow-inner container w-[1300px] border-2 border-gray-300 rounded-lg h-fit">
            <div className="shadow-inner container p-10 w-[1300px] border-2 border-gray-300 rounded-lg ">
              <h1 className="font-bold text-[40px] w-[400px]">
                Ajukan Karya Sekarang
              </h1>
              <p className="text-lg font-normal">
                Drop Your File and Wait our team to Validate
              </p>
              <br />
              <br />
              <FormButton
                type="button"
                onClick={() => setModal(true)}
                variant="base"
              >
                Here !
              </FormButton>
              {modal && (
                <ModalProfile
                  onClose={() => {
                    setModal(false);
                  }}
                >
                  <FileUploader />
                </ModalProfile>
              )}
            </div>
            <div className="shadow-inner container p-10 w-[1300px] h-fit">
              {file ? (
                <>
                  {file.map((file) => (
                    <div
                      key={file.id}
                      className="shadow-inner container flex justify-between p-10 w-full border-2 border-gray-300 rounded-lg relative mb-4"
                    >
                      <Link href={`${file.path}`}>{file.filename} <br />
                      <span className={`${file.status==="PENDING"?"text-yellow-500":file.status==="DENIED"?"text-red-500":"text-green-500"}`}>{file.status}</span>
                      </Link>
                      <button
                        onClick={() => router.push(file.path)}
                        className="ml-4 text-blue-500 hover:underline"
                      >
                        Lihat File
                      </button>
                    </div>
                  ))}
                </>
              ) : (
                <>Belum Ada Karya untuk dilihat ...</>
              )}
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default UploadPage;
