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

const UploadPage: React.FC = () => {
  const [modal, setModal] = useState(false);
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<userFullPayload | null>(null);
  const [openProfiles, setOpenProfiles] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [file, setFile] = useState<FileFullPayload[]>([]);
  const { data, error } = useSWR(`/api/getFiles`, fetcher, {
    refreshInterval: 1000,
  });
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
  return (
    <div className="pt-44">
      <>
        <div className="flex justify-center items-center w-screen h-screen">
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
                      <Link href={`${file.path}`}>{file.filename}</Link>
                      <div className="relative">
                        <FormButton
                          type="button"
                          variant="base"
                          onClick={() => handleProf(file.id)}
                          withArrow
                          className="flex justify-center gap-x-2 py-2 px-4"
                        >
                          <Image
                            src={file.user?.photo_profile as string}
                            alt="user image"
                            width={36}
                            height={36}
                            className="rounded-full"
                          />
                        </FormButton>
                        {openProfiles[file.id] && (
                          <div className="w-full p-2 max-w-56 bg-Secondary mt-1 border border-slate-300 rounded-lg absolute right-0 top-full z-10">
                            <LinkButton
                              variant="base"
                              href="/profile"
                              className="w-full"
                            >
                              <p className="mx-auto text-sm">Visit</p>
                            </LinkButton>
                            {session?.user?.role === "GURU" ? (
                              <FormButton variant="base" className="w-full">
                                <p className="mx-auto text-sm text-black border-t-2 border-Primary">
                                  Verified Now?
                                </p>
                              </FormButton>
                            ) : (
                              <FormButton variant="base" className="w-full">
                                <p className="mx-auto text-sm text-black border-t-2 border-Primary">
                                  Comment
                                </p>
                              </FormButton>
                            )}
                          </div>
                        )}
                      </div>
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
