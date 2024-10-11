"use client";
import { FileFullPayload } from "@/utils/relationsip";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ModalProfile from "./Modal";

export default function Card({
  bgImage,
  nama,
  file
}: {
  bgImage: string;
  nama: string;
  LinktoVisit: string;
  file: FileFullPayload;
}) {
  const [openProfiles, setOpenProfiles] = useState<boolean>(false);
  const router= useRouter();
  return (
    <div
      className="w-64 rounded-lg m-10 h-80 bg-cover bg-no-repeat relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-gradient-to-t from-black mix-blend-multiply to-white w-full h-2/3 bottom-0 absolute"></div>
      <div className="flex justify-start m-3 w-full h-fit absolute flex-col bottom-0">
        <h1 className="text-white font-bold border-b-2 w-56 border-b-secondary text-xl relative bottom-0">
          {nama}
        </h1>
        <button
          onClick={() =>
            file.mimetype.includes("msword") ||
            file.mimetype.includes(
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            )
              ? setOpenProfiles(true)
              : router.push(file.path)
          }
          className="ml-4 text-blue-500 hover:underline"
        >
          Lihat File
        </button>
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
    </div>
  );
}
