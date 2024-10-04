/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Gambar from "@/../public/img/HomeImage.png";
import Image from "next/image";
import { FormButton } from "../components/utils/Button";
import IconSubject from "../components/Icons/icon-Subject";
import Img from "../components/Icons/Img";
import Link from "next/link";
import { useEffect, useState } from "react";
import { userFullPayload } from "@/utils/relationsip";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<userFullPayload | null>(null);
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
  return (
    <>
    {userData?.role==="SISWA" ? (<>
      <div className="bg-Primary flex flex-col justify-center items-center">
        <div className="flex justify-center items-center h-screen bg-Primary">
          <div className="w-fit">
            <h1 className="text-3xl font-bold w-[400px]">
              Berjalan Bersama Kami Dengan Karyamu
            </h1>
            <p className="w-[400px] pt-5 text-sm font-semibold">
              G E L I A D Tempatmu Untuk Menjadikan Idemu Menjadi Sebuah Karya{" "}
              <br />
              Berjalan Bersama Kami dengan Karyamu
            </p>
          </div>
          <Image src={Gambar} alt="Gambar" width={520} height={400} />
        </div>

        <form className=" w-[1000px]">
          <label
            htmlFor="search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only"
          >
            Search
          </label>
          <div className="relative">
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
              className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
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
      <div className="h-[100px] pt-10 bg-[#F5F8FA]">
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
    </>) : (<>
      <div className="bg-Primary flex flex-col justify-center items-center">
        <div className="flex justify-center items-center h-screen bg-Primary">
          <div className="w-fit">
            <h1 className="text-3xl font-bold w-[400px]">
              Berjalan Bersama Menghasilkan Ribuan Karya
            </h1>
            <p className="w-[400px] pt-5 text-sm font-semibold">
              G E L I A D Tempatmu Untuk Menciptakan Banyak Bakat Hebat{" "}
              <br />
              Berjalan Bersama Untuk Generasi Hebat
            </p>
          </div>
          <Image src={Gambar} alt="Gambar" width={520} height={400} />
        </div>

        <form className=" w-[1000px]">
          <label
            htmlFor="search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only"
          >
            Search
          </label>
          <div className="relative">
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
              className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
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
    
    </>)}
    
    </>
  );
}
