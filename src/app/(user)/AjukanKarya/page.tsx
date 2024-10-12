/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { FormButton, LinkButton } from "@/app/components/utils/Button";
import FileUploader from "./_components/UploaderFile/page";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FileFullPayload, userFullPayload } from "@/utils/relationsip";
import { signOut, useSession } from "next-auth/react";
import ModalProfile from "@/app/components/utils/Modal";
import useSWR from "swr";
import { fetcher } from "@/utils/server-action/Fetcher";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RequestStatus, Role } from "@prisma/client";
import { updateStatus, updateUploadFileByLink } from "@/utils/server-action/userGetServerSession";
import toast from "react-hot-toast";
import { TextField } from "@/app/components/utils/Form";

export default function UploadPage(){
  const [modal, setModal] = useState(false);
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<userFullPayload | null>(null);
  const [openProfiles, setOpenProfiles] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [openUploadByLink, setOpenUploadByLink] = useState(false);
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
  const { data, error } = useSWR(`/api/getFiles?fileId=${userData?.id}`, fetcher, {
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
  // const handleClick= async (id:string)=>{
  //   try {
  //     const loading=toast.loading("Loading...");
  //     const formData = new FormData();
  //     formData.set("status", "VERIFIED" as RequestStatus);
  //     await updateStatus(id, formData)
  //     toast.success("Success", {id:loading});
  //   } catch (error) {
  //     throw new Error((error as Error).message);
  //   }
  // }
  
  const handleSubmitLink =async (formData: FormData)=>{
    try {
      const loading=toast.loading("Loading...");
      formData.set("userId", userData?.id as string);
      formData.set("role", userData?.role as Role);
      const update = await updateUploadFileByLink(formData);
      if(!update){
        toast.error("error adding link")
      }
      toast.success("Success", {id:loading});
      return update;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
  if(userData){
    if(status==="authenticated" && !userData.title) return router.push("/pilihRole");
  }
  if(status=="loading" || !userData) return <>Loading...</>;

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
              <FormButton
                type="button"
                onClick={() => setOpenUploadByLink(true)}
                variant="base"
              >
                Upload By Link
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
              {openUploadByLink && (
                <ModalProfile
                  onClose={() => {
                    setOpenUploadByLink(false);
                  }}
                >
                  <form onSubmit={(e) => {
              e.preventDefault();
              const formdata = new FormData(e.currentTarget);

              handleSubmitLink(formdata);
            }}>
                  <TextField type="text" name="name" label="Name File" placeholder="Name File" required={true}/>
                  <TextField type="text" name="type" label="Type File" placeholder="Type File" required={true}/>
                  <TextField type="text" name="url" label="Link File" placeholder="Link File" required={true}/>
                  <FormButton type="submit" variant="base">Submit</FormButton>
                  </form>
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
                        onClick={() =>file.mimetype.includes("msword") || file.mimetype.includes("application/vnd.openxmlformats-officedocument.wordprocessingml.document") ? handleProf(file.id) : router.push(file.path)}
                        className="ml-4 text-blue-500 hover:underline"
                      >
                        Lihat File
                        
                      </button>
                      <>
                        {openProfiles[file.id] && (
                          <ModalProfile
                            title={file.filename}
                            onClose={() =>
                              setOpenProfiles({
                                ...openProfiles,
                                [file.id]: false,
                              })
                            }
                            className="h-screen"
                          >
                            <iframe
                              className="w-full h-full"
                              src={`${file.path}&output=embed`}
                              frameBorder="9"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              contentEditable
                              sandbox="allow-scripts allow-modals allow-popups allow-presentation"
                              allowFullScreen
                            ></iframe>
                          </ModalProfile>
                        )}
                      </>
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

