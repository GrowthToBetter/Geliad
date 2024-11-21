/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { FormButton, LinkButton } from "@/app/components/utils/Button";
import FileUploader from "../AjukanKarya/_components/UploaderFile/page";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  FileFullPayload,
  GenreFullPayload,
  userFullPayload,
} from "@/utils/relationsip";
import ModalProfile from "@/app/components/utils/Modal";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Class, Genre, RequestStatus, Role } from "@prisma/client";
import {
  DeleteFile,
  updateUploadFileByLink,
} from "@/utils/server-action/userGetServerSession";
import toast from "react-hot-toast";
import { DropDown, TextField } from "@/app/components/utils/Form";
import ModalEditCoverFile from "../AjukanKarya/_components/ModalEditCoverFile";
import useSWR from "swr";
import { fetcher } from "@/utils/server-action/Fetcher";
import { deleteUser } from "@/utils/user.query";

export default function UploadPage({
  userData,
  genre,
}: {
  userData: userFullPayload;
  genre: GenreFullPayload[];
}) {
  const [modal, setModal] = useState(false);
  const [cover, setCover] = useState<{ [key: string]: boolean }>({});
  const [file, setFile] = useState<FileFullPayload[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<{ [key: string]: string }>(
    {}
  );
  const [openUploadByLink, setOpenUploadByLink] = useState(false);
  const [openRead, setOpenRead] = useState<{
    [key: string]: { isOpen: boolean; link: string };
  }>({});
  const handleRead = (id: string, link: string) => {
    setOpenRead((prev) => ({
      ...prev,
      [id]: {
        isOpen: !prev[id]?.isOpen,
        link: prev[id]?.link || link,
      },
    }));
  };
  const router = useRouter();
  const { data, error } = useSWR(
    `/api/getFiles?fileId=${userData?.id}`,
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

  const handleSubmitLink = async (formData: FormData, onClose: () => void) => {
    try {
      const loading = toast.loading("Loading...");
      formData.set("userId", userData?.id as string);
      formData.set("role", userData?.role as Role);
      for (const userId in selectedGenre) {
        formData.set("Genre", selectedGenre[userId]);
        const update = await updateUploadFileByLink(formData, userData);
        if (!update) {
          toast.error("error adding link");
        }
        toast.success("Success", { id: loading });
        onClose();
        return update;
      }
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };
  const handleRoleChangeGenre = (userId: string, newClass: string) => {
    setSelectedGenre((prev) => ({
      ...prev,
      [userId]: newClass,
    }));
  };
  const filteredGenre: string[] = [];
  for (const Genre of genre) {
    if (!filteredGenre.includes(Genre.Genre)) {
      filteredGenre.push(Genre.Genre);
    }
  }
  const handleDelete = async (id: string, file: FileFullPayload) => {
    const loadingToast = toast.loading("Deleting file...");

    try {
      if (!id || !file) {
        toast.error("Invalid file data", { id: loadingToast });
        return;
      }

      const response = await DeleteFile(id, file);

      if (response.status !== 200) {
        toast.error(response.message, { id: loadingToast });
        return;
      }

      toast.success("File deleted successfully", { id: loadingToast });

      router.refresh();

      return response;
    } catch (error) {
      console.error("Delete handler error:", error);
      toast.error(`Error: ${(error as Error).message}`, { id: loadingToast });
    }
  };
  if (!userData) {
    return <> Loading...</>;
  }
  if (!genre) {
    return <> Loading...</>;
  }
  return (
    <div className="pt-44">
      <>
        <div className="flex justify-center items-center min-w-max h-fit">
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
                  <FileUploader
                    onClose={() => {
                      setModal(false);
                    }}
                    userData={userData}
                    genre={genre}
                  />
                </ModalProfile>
              )}
              {openUploadByLink && (
                <ModalProfile
                  onClose={() => {
                    setOpenUploadByLink(false);
                  }}
                >
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formdata = new FormData(e.currentTarget);

                      handleSubmitLink(formdata, () => {
                        setOpenUploadByLink(false);
                      });
                    }}
                  >
                    <TextField
                      type="text"
                      name="name"
                      label="Name File"
                      placeholder="Name File"
                      required={true}
                    />
                    <TextField
                      type="text"
                      name="type"
                      label="Type File"
                      placeholder="Type File"
                      required={true}
                    />
                    <TextField
                      type="text"
                      name="url"
                      label="Link File"
                      placeholder="Link File"
                      required={true}
                    />
                    <div className="flex justify-between">
                      {Object.values(Class).map((classes) => (
                        <TextField
                          key={classes}
                          type="radio"
                          name="kelas"
                          value={`${classes}`}
                          label={`Kelas ${classes}`}
                        />
                      ))}

                      <DropDown
                        label="Genre"
                        options={filteredGenre.map((classes) => ({
                          label: classes,
                          value: classes,
                        }))}
                        className="rounded-xl flex justify-center items-center bg-moklet text-black p-3 m-3 font-bold"
                        name="Genre"
                        value={selectedGenre[userData?.id || ""]}
                        handleChange={(e: ChangeEvent<HTMLSelectElement>) =>
                          handleRoleChangeGenre(
                            userData?.id || "",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <FormButton type="submit" variant="base">
                      Submit
                    </FormButton>
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
                      <p className="w-1/3">
                        {file.filename} <br />
                        <span
                          className={` ${
                            file.status === "PENDING"
                              ? "text-yellow-500"
                              : file.status === "DENIED"
                              ? "text-red-500"
                              : "text-green-500"
                          }`}
                        >
                          {file.status}
                        </span>
                      </p>
                      <FormButton
                        variant="base"
                        onClick={() => {
                          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                          if (
                            file.mimetype.includes("msword") ||
                            file.mimetype.includes(
                              "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            ) ||
                            file.mimetype.includes("pdf")
                          ) {
                            handleRead(file.id, file.permisionId as string);
                          } else {
                            router.push(file.path);
                          }
                        }}
                        className=" hover:underline"
                      >
                        Baca
                      </FormButton>
                      <FormButton
                        type="button"
                        variant="base"
                        onClick={() => handleDelete(file.id, file)}
                      >
                        Delete Paper
                      </FormButton>
                      <FormButton
                        type="button"
                        variant="base"
                        onClick={() => {
                          setCover({ ...cover, [file.id]: true });
                        }}
                      >
                        Edit Cover
                      </FormButton>
                      {cover[file.id] && (
                        <ModalEditCoverFile
                          id={file.id}
                          setIsOpenModal={setCover}
                        />
                      )}
                      {openRead[file.id]?.isOpen && (
                        <ModalProfile
                          title={file.filename}
                          onClose={() => handleRead(file.id, "")}
                          className="h-screen"
                        >
                          <iframe
                            className="w-full h-full"
                            src={`https://drive.google.com/file/d/${
                              openRead[file.id]?.link
                            }/preview`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            sandbox="allow-scripts allow-modals allow-popups allow-presentation allow-same-origin"
                            allowFullScreen
                          ></iframe>
                        </ModalProfile>
                      )}
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
