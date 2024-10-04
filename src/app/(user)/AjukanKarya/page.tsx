/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { FormButton } from "@/app/components/utils/Button";
import FileUploader from "./_components/UploaderFile/page";
import { useEffect, useState } from "react";
import { FileFullPayload, userFullPayload } from "@/utils/relationsip";
import { useSession } from "next-auth/react";
import ModalProfile from "@/app/components/utils/Modal";
import useSWR from "swr";
import { fetcher } from "@/utils/server-action/Fetcher";
import { DropDown } from "@/app/components/utils/Form";
import Link from "next/link";
import { useRouter } from "next/navigation";

const UploadPage: React.FC = () => {
  const [modal, setModal] = useState(false);
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<userFullPayload | null>(null);
  const[file, setFile]=useState<FileFullPayload[] >([]);
  const { data, error } = useSWR(
    `/api/getFiles?userId=${session?.user?.id}`,
    fetcher,
    {
      refreshInterval: 1000,
    }
  );
  const router=useRouter();
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
  useEffect(() => {
    if (data) {
      const { user } = data;
      setFile(user);
    }
  }, [data]);
  return (
    <div>
      {userData?.role === "SISWA" ? (
        <>
          <h1>Upload File</h1>
          <div className="flex justify-center items-center w-screen h-screen">
            <div className="shadow-inner container w-[1300px] border-2 border-gray-300 rounded-lg h-[600px]">
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
              <div className="shadow-inner container p-10 w-[1300px] ">
                Belum Ada Karya untuk dilihat ...
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center w-screen h-screen">
          <div className="shadow-inner container w-[1300px] border-2 border-gray-300 rounded-lg h-[600px]">
        {file.map((file)=>(
          <div key={file.id} className="shadow-inner container p-10 w-[1300px] border-2 border-gray-300 rounded-lg">
            <Link href={`${file.path}`}>{file.filename}</Link>
          </div>
        ))}

          </div>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
