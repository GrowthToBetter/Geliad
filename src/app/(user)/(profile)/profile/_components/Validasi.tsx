/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { FormButton, LinkButton } from "@/app/components/utils/Button";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FileFullPayload, userFullPayload } from "@/utils/relationsip";
import { signOut, useSession } from "next-auth/react";
import ModalProfile from "@/app/components/utils/Modal";
import useSWR from "swr";
import { fetcher } from "@/utils/server-action/Fetcher";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { RequestStatus } from "@prisma/client";
import {
  addViews,
  commentFile,
  DeleteRoleFileFromNotif,
  updateStatus,
} from "@/utils/server-action/userGetServerSession";
import toast from "react-hot-toast";
import { TextField } from "@/app/components/utils/Form";
import { updateFile } from "@/utils/user.query";

export default function UploadPage({
  userData,
  file,
}: {
  userData: userFullPayload;
  file: FileFullPayload[];
}) {
  const { data: session, status } = useSession();
  const [taskFields, setTaskFields] = useState([{ task: "", details: [""] }]);
  const [openProfiles, setOpenProfiles] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [openFile, setOpenFile] = useState<{ [key: string]: boolean }>({});
  const [modal, setModal] = useState(false);
  const pathName = usePathname();
  const router = useRouter();

  const handleProf = (id: string) => {
    setOpenProfiles((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  const handlefile = (id: string) => {
    setOpenFile((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  const handleTaskChange = (index: number, value: string) => {
    const newTaskFields = [...taskFields];
    newTaskFields[index].task = value;
    setTaskFields(newTaskFields);
  };
  const handleAddTaskField = () => {
    setTaskFields([...taskFields, { task: "", details: [""] }]);
  };
  const handleMinTaskField = () => {
    if (taskFields.length > 1) {
      setTaskFields(taskFields.slice(0, -1));
    }
  };
  const handleModal = () => {
    setModal(!modal);
  };
  const handleClick = async (id: string, status: string) => {
    try {
      const loading = toast.loading("Loading...");
      const formData = new FormData();
      formData.set("status", status as RequestStatus);
      await updateStatus(id, formData);
      toast.success("Success", { id: loading });
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };
  const filteredFile =
    userData?.role === "GURU"
      ? file.filter((file) => file.userRole === "SISWA")
      : userData?.role === "VALIDATOR"
      ? file.filter((file) => file.userRole === "GURU")
      : file.filter((file) => file.userRole !== "DELETE");
  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
    idFile: string,
    idUser: string
  ) => {
    e.preventDefault();
    try {
      const loading = toast.loading("Loading...");
      const formData = new FormData(e.target as HTMLFormElement);

      for (const field of taskFields) {
        formData.set("Task", field.task);
        const user = {
          connect: {
            id: idUser,
          },
        };
        const file = {
          connect: {
            id: idFile,
          },
        };
        await commentFile(formData.get("Task") as string, file, user);
      }
      toast.success("Success", { id: loading });
      setTaskFields([{ task: "", details: [""] }]);
      setModal(false);
      console.log(formData);
    } catch (error) {
      toast.error(`Error: ${(error as Error).message}`);
    }
  };
  const handleRemove = (fileId: string) => {
    try {
      const loading = toast.loading("Loading...");
      const update = DeleteRoleFileFromNotif(fileId);
      if (!update) {
        throw new Error("eror");
      }
      toast.success("Success", { id: loading });
      return update;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };
  const addView = async (file: FileFullPayload) => {
    const loading = toast.loading("Loading...");
    try {
      const update = await addViews(file.id, file.views+1);
      if (!update) {
        toast.error("Gagal Menambahkan Like");
      }
      toast.success("Success", { id: loading });
      return update;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };
  return (
    <div className="min-h-screen-minus-10">
      <>
        {userData?.role === "GURU" ||
        userData?.role === "VALIDATOR" ||
        userData?.role === "ADMIN" ? (
          <>
            <ul className="flex pt-32 justify-evenly font-semibold   ">
              <li>
                <Link
                  href={"/profile/notification/Karya"}
                  className={`flex m-10 p-5 rounded-md hover:border-2 hover:border-[#F5F8FA] ${
                    pathName === "/notification/Karya" ? "bg-[#F5F8FA]" : ""
                  }`}
                >
                  Karya Yang Diajukan
                </Link>
              </li>
              <li>
                <Link
                  href={"/profile/notification/Validasi"}
                  className={`flex m-10 p-5 rounded-md hover:border-2 hover:border-[#F5F8FA] ${
                    pathName === "/notification/Validasi" ? "bg-[#F5F8FA]" : ""
                  }`}
                >
                  Validasi Karya
                </Link>
              </li>
            </ul>
          </>
        ) : (
          <></>
        )}
        <div
          className={`flex justify-center items-center min-w-max h-fit ${
            userData?.role == "SISWA" ? "pt-44" : ""
          }`}
        >
          <div className="shadow-inner container w-[1300px] border-2 border-gray-300 rounded-lg h-fit">
            <div className="shadow-inner container p-10 w-[1300px] border-2 border-gray-300 rounded-lg ">
              <h1 className="font-bold text-[40px] w-[400px]">
                Validate Karya Sekarang
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
                      <FormButton
                        type="button"
                        variant="base"
                        onClick={() => handleRemove(file.id)}
                      >
                        delete
                      </FormButton>
                      <button
                        onClick={() =>{
                          file.mimetype.includes("msword") ||
                          file.mimetype.includes(
                            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          )
                            ? handlefile(file.id)
                            : router.push(file.path);
                          addView(file);
                        }
                        }
                        className="ml-4 text-blue-500 hover:underline"
                      >
                        Lihat File
                      </button>
                      <>
                        {openFile[file.id] && (
                          <ModalProfile
                            title={file.filename}
                            onClose={() =>
                              setOpenFile({
                                ...openFile,
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
                              sandbox="allow-scripts allow-modals allow-popups allow-presentation allow-same-origin"
                              allowFullScreen
                            ></iframe>
                          </ModalProfile>
                        )}
                      </>
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
                                  handleClick(file.id, "VERIFIED");
                                }}
                                className="w-full"
                              >
                                <p className="mx-auto text-sm text-black border-t-2 border-Primary">
                                  Verified
                                </p>
                              </FormButton>
                              <FormButton
                                variant="base"
                                onClick={() => {
                                  handleClick(file.id, "DENIED");
                                }}
                                className="w-full"
                              >
                                <p className="mx-auto text-sm text-black border-t-2 border-Primary">
                                  Denied
                                </p>
                              </FormButton>
                              <FormButton
                                variant="base"
                                onClick={handleModal}
                                className="w-full"
                              >
                                <p className="mx-auto text-sm text-black border-t-2 border-Primary">
                                  comment
                                </p>
                              </FormButton>
                            </div>
                            {modal && (
                              <ModalProfile
                                onClose={() => setModal(false)}
                                title="comment"
                              >
                                <form
                                  onSubmit={(e) =>
                                    handleSubmit(
                                      e,
                                      file.id,
                                      userData?.id as string
                                    )
                                  }
                                >
                                  {taskFields.map((field, taskIndex) => (
                                    <div
                                      key={taskIndex}
                                      className="w-full mb-4 p-4 bg-white border-2 border-moklet drop-shadow rounded-[12px]"
                                    >
                                      <div className="flex items-center justify-between">
                                        <TextField
                                          type="input"
                                          label={`ADD Comment ${taskIndex + 1}`}
                                          name={`Task-${taskIndex}`}
                                          value={field.task}
                                          handleChange={(e) =>
                                            handleTaskChange(
                                              taskIndex,
                                              e.target.value
                                            )
                                          }
                                          className="w-full m-3 text-black"
                                        />
                                      </div>
                                      <div className="flex justify-start">
                                        <FormButton
                                          type="button"
                                          onClick={() => handleAddTaskField()}
                                          className="rounded-full flex justify-center items-center text-center"
                                          variant="base"
                                        >
                                          +
                                        </FormButton>
                                        <FormButton
                                          type="button"
                                          onClick={() => handleMinTaskField()}
                                          className="rounded-full flex justify-center items-center text-center"
                                          variant="base"
                                        >
                                          -
                                        </FormButton>
                                      </div>
                                    </div>
                                  ))}
                                  <FormButton type="submit" variant="base">
                                    Submit
                                  </FormButton>
                                </form>
                              </ModalProfile>
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
}
