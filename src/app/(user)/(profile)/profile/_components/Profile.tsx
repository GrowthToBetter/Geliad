"use client";
import React, { useState } from "react";
import Image from "next/image";
import { userFullPayload } from "@/utils/relationsip";
import {  Gender } from "@prisma/client";
import { useRouter } from "next/navigation";
import { FormButton } from "@/app/components/utils/Button";
import ModalProfile from "@/app/components/utils/Modal";
import { DropDown,  TextField } from "@/app/components/utils/Form";
import toast from "react-hot-toast";
import { UpdateGeneralProfileById } from "@/utils/server-action/userGetServerSession";
import Link from "next/link";
import ModalEditCover from "./ModalEditCover";

export default function Profile({userData}:{userData:userFullPayload}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const [cover, setCover] = useState(false);
  const [modal, setModal] = useState(false);
  const handleModal = () => {
    setModal(!modal);
  };
  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);

    try {
      await UpdateGeneralProfileById(formData);
      toast.success("Sukses Mengisi Data");
      setIsLoading(false);
      router.push("/profile");
      window.location.reload();
    } catch (error) {
      console.log((error as Error).message);
      setIsLoading(false);

      toast.error("Gagal Mengedit Profil");
    }
  };
  return (
    <div className="bg-slate-100 p-0 sm:p-5 md:p-10 lg:p-15 xl:p-20">
      <div className="mt-24 bg-white rounded-3xl p-10 sm:p-10 md:p-15 lg:p-20 xl:p-24 relative overflow-hidden">
        <div className={`absolute inset-0 z-0 h-72 `}>
        <Image
            quality={100}
            unoptimized
            src={(userData?.cover as string) || "https://res.cloudinary.com/dhjeoo1pm/image/upload/v1726727429/mdhydandphi4efwa7kte.png"}
            width={100}
            height={1000}
            alt="banner profile"
            className="w-full md:h-full h-28 object-cover"
          />
        </div>
        <FormButton variant="base" className="absolute top-8 right-10" onClick={() => setCover(true)}>
          Edit Cover
        </FormButton>
        {cover && <ModalEditCover setIsOpenModal={setCover} />}
        <div className="relative z-10 flex flex-col items-start mt-44 sm:mt-48 md:mt-44 lg:mt-32 xl:mt-28">
          <div className="w-32 h-32 sm:w-24 md:w-32 flex place-items-center lg:w-36 xl:w-40 sm:h-24 md:h-32 lg:h-36 xl:h-40 rounded-full bg-gray-300 mb-4 overflow-hidden">
            <Image
              src={(userData?.photo_profile as string ) || "https://res.cloudinary.com/dvwhepqbd/image/upload/v1720580914/pgfrhzaobzcajvugl584.png"}
              alt="Image Profile"
              width={180}
              height={180}
              className="mx-auto"
              />
          </div>
          <div className="mt-4 flex w-full justify-between">
            <h1 className="text-2xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl font-normal">
              {userData?.name}
              {
                `${
                  userData?.clasess ? `(${userData.clasess})` : " "
                }` as string
              }
            </h1>
            <div className="flex gap-x-2">
              <FormButton variant="base" onClick={handleModal}>
                Edit Profile
              </FormButton>
            </div>
          </div>
          <div className="h-2">
            <Link className="text-Secondary hover:text-blue-500 active:text-blue-500" href={`https://wa.me/${userData?.Phone?.includes("0") ? userData?.Phone?.replace("0", "62"): userData?.Phone}`}>wa.me/{userData?.Phone?.includes("0") ? userData?.Phone?.replace("0", "62"): userData?.Phone}</Link>
          </div>
        </div>

      </div>
      {modal && (
        <ModalProfile onClose={() => setModal(false)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formdata = new FormData(e.currentTarget);
              handleSubmit(formdata);
            }}
          >
            <TextField
              type="text"
              label="Name"
              readOnly
              disabled
              defaultValue={userData?.name as string}
            />
            <TextField
              type="text"
              label="Email"
              readOnly
              disabled
              defaultValue={userData?.email as string}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-3">
              {userData?.role === "SISWA" ? (<>
              <TextField
                type="text"
                label="Absent"
                name="absent"
                defaultValue={userData?.absent as string}
              />
              </>): (<>
              </>)}
              
              <TextField
                type="text"
                label="Phone"
                placeholder="62xxxxxxxx"
                name="Phone"
                defaultValue={userData?.Phone as string}
              />

              <DropDown
                label="Gender"
                defaultValue={userData?.gender as string}
                options={Object.values(Gender).map((x) => ({
                  label: x,
                  value: x,
                }))}
                name="gender"
              />
            </div>
            <div className="flex justify-end w-full gap-x-4 pb-4">
              <FormButton onClick={() => setModal(false)} variant="white">
                Close
              </FormButton>
              <FormButton type="submit" variant="base">
                {!isLoading ? (
                  "Edit"
                ) : (
                  <div className="flex gap-x-3 items-center">
                    <svg
                      aria-hidden="true"
                      className="inline w-5 h-5 animate-spin text-red-500 fill-white"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span>Loading...</span>
                  </div>
                )}
              </FormButton>
            </div>
          </form>
        </ModalProfile>
      )}
    </div>
  );
}
