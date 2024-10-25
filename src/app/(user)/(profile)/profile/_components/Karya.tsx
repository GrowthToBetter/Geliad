/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { FormButton, LinkButton } from "@/app/components/utils/Button";
import { useEffect, useState } from "react";
import { FileFullPayload, userFullPayload } from "@/utils/relationsip";
import { signOut, useSession } from "next-auth/react";
import ModalProfile from "@/app/components/utils/Modal";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function UploadPage({
  userData,
  file,
}: {
  userData: userFullPayload;
  file: FileFullPayload[];
}) {
  const { data: session, status } = useSession();
  const [openProfiles, setOpenProfiles] = useState<{ [key: string]: boolean }>(
    {}
  );
  const pathName = usePathname();
  const router = useRouter();
  const [comment, setComment] = useState<{ [key: string]: boolean }>(
    {}
  );

  const handleProf = (id: string) => {
    setOpenProfiles((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  const handleComment = (id: string) => {
    setComment((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  const filteredFile = file.filter((file) => file.userId == userData?.id);
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
                Status Karya Yang Diajukan
              </h1>
            </div>
            <div className="shadow-inner container p-10 w-[1300px] h-fit">
              {filteredFile && filteredFile.length > 0 ? (
                <>
                  {filteredFile.map((file) => (
                    <>
                    {file.comment.length > 0 && (
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
                      
                        <>
                          <FormButton
                            variant="base"
                            type="button"
                            onClick={() => {
                              handleComment(file.id);
                            }}
                          >
                            {" "}
                            Comment From Validator
                          </FormButton>
                        </>
                      {comment[file.id] && (
                        <ModalProfile
                          onClose={() => {
                            handleComment(file.id);
                          }}
                        >
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
                        onClick={() =>
                          file.mimetype.includes("msword") ||
                          file.mimetype.includes(
                            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          )
                            ? handleProf(file.id)
                            : router.push(file.path)
                        }
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
                              sandbox="allow-scripts allow-modals allow-popups allow-presentation allow-same-origin"
                              allowFullScreen
                            ></iframe>
                          </ModalProfile>
                        )}
                      </>
                    </div>
                      )}
                      </>
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
