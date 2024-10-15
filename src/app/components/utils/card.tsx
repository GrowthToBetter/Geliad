"use client";
import { FileFullPayload } from "@/utils/relationsip";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ModalProfile from "./Modal";
import { FormButton } from "./Button";
import toast from "react-hot-toast";

import { addLike, addViews } from "@/utils/server-action/userGetServerSession";

export default function Card({
  bgImage,
  nama,
  file,
  className,
}: {
  bgImage: string;
  nama: string;
  LinktoVisit: string;
  file: FileFullPayload;
  className?: string;
}) {
  const [openProfiles, setOpenProfiles] = useState<boolean>(false);
  const router = useRouter();
  const [like, setLike] = useState<boolean>(false);
  const addLikes = async () => {
    setLike(!like);
    const loading = toast.loading("Loading...");
    try {
      const update = await addLike(
        file.id,
        like ? file.Like - 1 : file.Like + 1
      );
      if (!update) {
        toast.error("Gagal Menambahkan Like");
      }
      toast.success("Success", { id: loading });
      return update;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };
  const addView = async () => {
    const loading = toast.loading("Loading...");
    try {
      const update = await addViews(file.id, file.views + 1);
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
    <div
      className={`w-64 rounded-lg h-80 bg-cover bg-no-repeat relative ${className}`}
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-gradient-to-t from-black mix-blend-multiply to-white w-full h-2/3 bottom-0 absolute"></div>
      <div className="flex justify-between absolute w-full h-full flex-col items-center">
        <h1 className="text-black bg-Primary font-bold border-b-2 w-full border-b-secondary text-sm relative bottom-0">
          {nama}
        </h1>
        <div>
          <FormButton
            variant="base"
            onClick={() => {
              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              file.mimetype.includes("msword") ||
              file.mimetype.includes(
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              )
                ? setOpenProfiles(true)
                : router.push(file.path);
              addView();
            }}
            className=" text-blue-500 hover:underline"
          >
            Lihat File
          </FormButton>
          <div className="flex justify-between">
          <button className="text-white hover:underline" onClick={addLikes}>
            Like : {file.Like}
          </button>
          <p className="text-white">views: {file.views}</p>

          </div>
        </div>
        <>
          {openProfiles && (
            <ModalProfile
              title={file.filename}
              onClose={() => setOpenProfiles(false)}
              className="h-screen"
            >
              <iframe
                className="w-full h-full"
                src={`${file.path}&output=embed`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                sandbox="allow-scripts allow-modals allow-popups allow-presentation allow-same-origin"
                allowFullScreen
              ></iframe>
            </ModalProfile>
          )}
        </>
      </div>
    </div>
  );
}
