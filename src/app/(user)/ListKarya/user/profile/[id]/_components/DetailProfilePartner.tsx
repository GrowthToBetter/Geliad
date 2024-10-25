
import { Prisma } from "@prisma/client";
import Image from "next/image";
import React from "react";

export default function DetailProfilePartner({
  userData,
  userId,
}: {
  userData: Prisma.UserGetPayload<{include:{userAuth: true, File: { include: { TaskValidator: true } }, taskValidator: { include: { user: true } }, comment: { include: { file: true } }}}>;
  userId: string;
}) {
  const currentTeam = userData.File.find((x) => x.userId === userId);

  return (
    <>
      <div className="bg-slate-100 p-0 sm:p-5 md:p-10 lg:p-15 xl:p-20">
        <div className="mt-24 bg-white md:rounded-3xl p-10 sm:p-10 md:p-15 lg:p-20 xl:p-24 relative overflow-hidden">
          <div className="absolute inset-0 z-0 h-72">
            <Image src={userData.cover as string} width={100} height={100} quality={100} unoptimized alt="banner profile" className="w-full md:h-full h-28 object-cover" />
          </div>
          <div className="relative z-10 flex flex-col items-start md:mt-44 lg:mt-32 xl:mt-28">
            <div className="w-32 h-32 sm:w-24 md:w-32 flex place-items-center lg:w-36 xl:w-40 sm:h-24 md:h-32 lg:h-36 xl:h-40 rounded-full bg-gray-300 mb-4 overflow-hidden">
              <Image src={userData.photo_profile as string} alt="Image Profile" width={180} height={180} className="mx-auto" />
            </div>
            <div className="mt-4 flex w-full justify-between">
              <h1 className="text-2xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl font-normal">
                {userData?.name  as string} 
              </h1>
              <div className="flex gap-x-2"></div>
            </div>
            <div className="h-2"></div>
            <p className="text-gray-500 text-lg sm:text-lg md:text-xl lg:text-xl">{userData?.clasess}</p>
            <div className="flex items-center gap-x-4 mb-2">
              <svg className="w-6 h-6 text-slate-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.143 4H4.857A.857.857 0 0 0 4 4.857v4.286c0 .473.384.857.857.857h4.286A.857.857 0 0 0 10 9.143V4.857A.857.857 0 0 0 9.143 4Zm10 0h-4.286a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286A.857.857 0 0 0 20 9.143V4.857A.857.857 0 0 0 19.143 4Zm-10 10H4.857a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286a.857.857 0 0 0 .857-.857v-4.286A.857.857 0 0 0 9.143 14Zm10 0h-4.286a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286a.857.857 0 0 0 .857-.857v-4.286a.857.857 0 0 0-.857-.857Z"
                />
              </svg>
            </div>
            <div className="flex items-center gap-x-4">
              <svg className="w-6 h-6 text-slate-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 6a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm-1.5 8a4 4 0 0 0-4 4 2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-3Zm6.82-3.096a5.51 5.51 0 0 0-2.797-6.293 3.5 3.5 0 1 1 2.796 6.292ZM19.5 18h.5a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-1.1a5.503 5.503 0 0 1-.471.762A5.998 5.998 0 0 1 19.5 18ZM4 7.5a3.5 3.5 0 0 1 5.477-2.889 5.5 5.5 0 0 0-2.796 6.293A3.501 3.501 0 0 1 4 7.5ZM7.1 12H6a4 4 0 0 0-4 4 2 2 0 0 0 2 2h.5a5.998 5.998 0 0 1 3.071-5.238A5.505 5.505 0 0 1 7.1 12Z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-left text-gray-800 text-lg sm:text-lg md:text-xl lg:text-xl">{userData.status}</p>
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-start mt-8">
            <h2 className="font-normal text-2xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl mb-4">File</h2>
            <div className="flex flex-wrap justify-start gap-x-4 gap-y-2 mb-8 mt-4">
              {userData && userData?.File.length != 0 ? (
                <>
                  {userData?.File.map((skill, i) => (
                    <div key={i} className="text-sm sm:text-sm md:text-lg lg:text-xl xl:text-xl px-4 py-2 bg-red-500 text-white rounded-full">
                      {skill.filename}
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <p className="font-medium text-slate-500 italic">Belum Ada Skill yang Ditambahkan</p>
                </>
              )}
            </div>
          </div>

          <div className="relative z-10 lg:flex justify-between items-start">
            <div>
              <h2 className="text-2xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl font-normal mb-4">Paper List</h2>
              <p className="font-semibold text-xl mb-4">
                Team Name :{" "}
                {currentTeam?.status ? (
                  <span className="className='text-[#F45846]'">{currentTeam?.filename}</span>
                ) : (
                  <span className="text-slate-500 font-medium">
                    <i>Dont Have Uploaded File</i>
                  </span>
                )}
              </p>
            </div>

            <div>
              <h2 className="text-2xl mt-8 sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl font-normal mb-4">Social Media</h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
