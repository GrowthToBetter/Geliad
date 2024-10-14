/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Gambar from "@/../public/img/HomeImage.png";
import Image from "next/image";
import { FormButton } from "../../components/utils/Button";
import { Archivo_Black } from "next/font/google";
const archivo_black = Archivo_Black({ weight: "400", subsets: ["latin"] });
import IconSubject from "../../components/Icons/icon-Subject";
import Img from "../../components/Icons/Img";
import Link from "next/link";
import gambar1 from "@/../public/img/Gambar.png";
import { useEffect, useState } from "react";
import { FileFullPayload, userFullPayload } from "@/utils/relationsip";
import { signIn, useSession } from "next-auth/react";
import { fetcher } from "@/utils/server-action/Fetcher";
import useSWR from "swr";
import Card from "../../components/utils/card";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Home({userData, files}: {userData:userFullPayload , files:FileFullPayload[]}) {
  const { data: session, status } = useSession();
  const router=useRouter();
  const filteredFiles = files.filter((file) => file.status === "VERIFIED");
  return (
    <div className="">
      <div className="bg-Primary min-w-max p-10 flex flex-col justify-center items-center relative">
        <div className="flex justify-center relative mt-14 md:m-0 flex-col md:flex-row items-center h-screen w-fit bg-Primary">
          <div className="w-full mt-20">
            <h1 className="text-3xl font-bold md:w-[400px] w-[200px]">
              Berjalan Bersama Menghasilkan Ribuan Karya
            </h1>
            <p className="md:w-[400px] w-[200px] pt-5 text-sm font-semibold">
              G E L I A D Tempatmu Untuk Menciptakan Banyak Bakat Hebat <br />
              Berjalan Bersama Untuk Generasi Hebat
            </p>
            <FormButton
              onClick={() => router.push("/AjukanKarya")}
              className="mt-20 scale-125 ml-4"
              variant="base"
            >
              Ajukan Sekarang
            </FormButton>
          </div>
          <Image src={Gambar} alt="Gambar" width={520} height={400} />
          <form className=" md:min-w-full min-w-max absolute md:top-32 right-0 top-12" onSubmit={(e) => toast.error("Fitur ini sedang dalam tahap pengembangan")}>
            <label
              htmlFor="search"
              className="mb-2 text-sm font-medium text-gray-900 sr-only"
            >
              Search
            </label>
            <div className="relative min-w-max">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="search"
                className="block min-w-max md:min-w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search"
                required
              />
              <FormButton
                type="submit"
                className="text-white absolute end-2.5 bg-Secondary hover:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 "
              >
                Search
              </FormButton>
            </div>
          </form>
        </div>
        <div className="h-[100px] w-full pt-10 bg-[#F5F8FA]">
          <ul className="flex justify-evenly font-semibold  ">
            <li>
              <Link href={"/AjukanKarya"} className="flex">
                <IconSubject />
                Ajukan Karya
              </Link>
            </li>
            <li>
              <Link href={"/"} className="flex">
                <Img />
                List Karya
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className=" max-w-max bg-slate-500 flex-wrap flex justify-center items-center relative">
          {filteredFiles.map((file, i) => (
            <Card
              LinktoVisit={file.path}
              bgImage={ file?.coverFile ? file.coverFile :"https://www.shutterstock.com/image-vector/none-icon-thin-linear-outline-260nw-2139308813.jpg"}
              nama={file.filename}
              key={i}
              className="m-5"
              file={file}
            />
          ))}
      </div>
      <div>
        <div className="justify-center flex bg-white pt-40 flex-col h-screen xl:flex-row items-center px-4">
          <div className="max-w-max">
            <h1
              className={`text-[64px] text-start ${archivo_black.className} leading-none`}
            >
              <span className="text-red-500">G</span>ELIAD
            </h1>
            <p className="xl:text-[32px] lg:text-[30px] md:text-[28px] sm:text-[26px] text-[24px] font-normal my-2">
              Berjalan Bersama Menghasilkan Ribuan Karya
            </p>
            <FormButton
              onClick={() => signIn()}
              className="mt-[17px] scale-125 ml-4"
              variant="base"
            >
              Get Started Now!
            </FormButton>
          </div>
          <div className="mt-12">
            <Image
              src={gambar1}
              width={500}
              height={500}
              alt="Orang Sukses Amin"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
