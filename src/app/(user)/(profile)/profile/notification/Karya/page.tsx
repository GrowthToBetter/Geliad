/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { FormButton, LinkButton } from "@/app/components/utils/Button";
import { useEffect, useState } from "react";
import { FileFullPayload, userFullPayload } from "@/utils/relationsip";
import { signOut, useSession } from "next-auth/react";
import ModalProfile from "@/app/components/utils/Modal";
import useSWR from "swr";
import { fetcher } from "@/utils/server-action/Fetcher";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { RequestStatus } from "@prisma/client";
import { updateStatus } from "@/utils/server-action/userGetServerSession";
import toast from "react-hot-toast";

export default function UploadPage() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<userFullPayload | null>(null);
  const [openProfiles, setOpenProfiles] = useState<{ [key: string]: boolean }>(
    {}
  );
  const pathName = usePathname();
  const [file, setFile] = useState<FileFullPayload[]>([]);
  const router = useRouter();
  const [comment, setComment] = useState(false);
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

  const { data, error } = useSWR(
    `/api/getFiles${
      userData?.role === "SISWA" ? `?fileId=${userData?.id}` : ""
    }`,
    fetcher,
    {
      refreshInterval: 1000,
    }
  );
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

  const handleClick = async (id: string) => {
    try {
      const loading = toast.loading("Loading...");
      const formData = new FormData();
      formData.set("status", "VERIFIED" as RequestStatus);
      await updateStatus(id, formData);
      toast.success("Success", { id: loading });
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };
  const filteredFile = file.filter((file) => file.userId == userData?.id);
  if (userData) {
    if (status === "authenticated" && !userData.title)
      return router.push("/pilihRole");
  }
  return (
    <div className="min-h-screen-minus-10">
      <>
        {userData?.role ==="GURU" || userData?.role==="VALIDATOR" ? <>
          <ul className="flex pt-32 justify-evenly font-semibold   ">
            <li>
              <Link href={"/profile/notification/Karya"} className={`flex m-10 p-5 rounded-md hover:border-2 hover:border-[#F5F8FA] ${pathName === "/notification/Karya" ? "bg-[#F5F8FA]" : ""}`}>
                Karya Yang Diajukan
              </Link>
            </li>
            <li>
              <Link href={"/profile/notification/Validasi"} className={`flex m-10 p-5 rounded-md hover:border-2 hover:border-[#F5F8FA] ${pathName === "/notification/Validasi" ? "bg-[#F5F8FA]" : ""}`}>
                Validasi Karya
              </Link>
            </li>
          </ul>
        </> : <></>}
        <div className={`flex justify-center items-center w-screen h-fit ${userData?.role=="SISWA" ? "pt-44" : ""}`}>
          <div className="shadow-inner container w-[1300px] border-2 border-gray-300 rounded-lg h-fit">
            <div className="shadow-inner container p-10 w-[1300px] border-2 border-gray-300 rounded-lg ">
              <h1 className="font-bold text-[40px] w-[400px]">
                Status Karya Yang Diajukan
              </h1>
            </div>
            <div className="shadow-inner container p-10 w-[1300px] h-fit">
              {filteredFile && filteredFile.length > 0 ? (
                <>
                  {filteredFile.map((file) => (
                    <div
                      key={file.id}
                      className="shadow-inner container flex justify-between p-10 w-full border-2 border-gray-300 rounded-lg relative mb-4"
                    >
                      <Link href={`${file.path}`}>
                        {file.filename} <br />
                        <span
                          className={`${
                            file.status === "PENDING"
                              ? "text-yellow-500"
                              : file.status === "DENIED"
                              ? "text-red-500"
                              : "text-green-500"
                          }`}
                        >
                          {file.status}
                        </span>
                      </Link>
                      {file.comment.length > 0 && (<>
                        <FormButton variant="base" type="button" onClick={()=>{setComment(!comment)}}> Comment From Validator</FormButton>
                      </>
                      )}
                      {comment && (
                        <ModalProfile  onClose={() => { setComment(false); } } >
                          {file.comment.map((comment) => (
                             <div
                             key={file.id}
                             className="shadow-inner container flex justify-between p-10 w-full border-2 border-gray-300 rounded-lg relative mb-4"
                           >
                             <p>{comment.Text}</p>
                             <p>{comment.user?.name}</p>
                           </div>
                          ))}
                        </ModalProfile>
                      )}
                      <button
                        onClick={() => router.push(file.path)}
                        className="ml-4 text-blue-500 hover:underline"
                      >
                        Lihat File
                      </button>
                      <div className="relative">
                        <>
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
                        </>
                        {openProfiles[file.id] && (
                          <div className="w-full p-2 max-w-56 bg-Secondary mt-1 border border-slate-300 rounded-lg absolute right-0 top-full z-10">
                            <div>
                              <LinkButton
                                variant="base"
                                href={`/profile/${file.user?.id}`}
                                className="w-full"
                              >
                                <p className="mx-auto text-sm">Visit</p>
                              </LinkButton>
                              <FormButton
                                variant="base"
                                onClick={() => {
                                  handleClick(file.id);
                                }}
                                className="w-full"
                              >
                                <p className="mx-auto text-sm text-black border-t-2 border-Primary">
                                  Verified
                                </p>
                              </FormButton>
                            </div>
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
}
