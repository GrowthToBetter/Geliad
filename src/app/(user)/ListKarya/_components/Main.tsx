/* eslint-disable @typescript-eslint/no-empty-object-type */
"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";
import hipster from "@/../public/svg/hipsterP.png";
import setting from "@/../public/svg/settingsP.png";
import { FormButton, LinkButton } from "@/app/components/utils/Button";
import { Class, Prisma } from "@prisma/client";
import { Session } from "next-auth";
import { FileFullPayload, GenreFullPayload } from "@/utils/relationsip";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { addLike, addViews } from "@/utils/server-action/userGetServerSession";
import ModalProfile from "@/app/components/utils/Modal";
import { TextField } from "@/app/components/utils/Form";

export default function Main({
  ListData,
  session,
  currentUser,
  genre,
}: {
  ListData: FileFullPayload[];
  session: Session;
  currentUser: Prisma.UserGetPayload<{}>;
  genre: GenreFullPayload[];
}) {
  const [searchInput, setSearchInput] = useState<string>("");
  const [selected, setSelected] = useState("All");
  const [classes, setClasses]=useState<string|null>("All");
  const [filteredUser, setFilteredUser] = useState<FileFullPayload[]>(ListData);

  useEffect(() => {
    const filterUsers = () => {
      const filteredByName = ListData.filter((userData: FileFullPayload) =>
        userData.filename.toLowerCase().includes(searchInput.toLowerCase())
      );
      const finalFilteredUsers =
      selected === "All" && classes === "All"
        ? filteredByName
        : selected === "All" ? filteredByName.filter(
            (dataList: FileFullPayload) => dataList.userClasses === (classes as Class)
          ) : classes === "All" ? filteredByName.filter(
            (dataList: FileFullPayload) => dataList.genre === selected
          ): filteredByName.filter(
            (dataList: FileFullPayload) => dataList.genre === selected && dataList.userClasses === (classes as Class)
          );
      setFilteredUser(finalFilteredUsers);
    };
    filterUsers();
  }, [ListData, classes, searchInput, selected]);

  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleButtonFilter = (data: string) => {
    setSelected(data);
  };
  const handleButtonFilterClass = (data: string) => {
    if (data === "All") {
      setClasses(null); 
    }
    setClasses(data);
  };
  console.log(filteredUser);
  const filteredGenre: string[] = [];
  for (const Genre of genre) {
    if (!filteredGenre.includes(Genre.Genre)) {
      filteredGenre.push(Genre.Genre);
    }
  }
  const addView = async (file: FileFullPayload) => {
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
  const [openProfiles, setOpenProfiles] = useState<boolean>(false);
  const router = useRouter();
  const [like, setLike] = useState<boolean>(false);
  const addLikes = async (file: FileFullPayload) => {
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
  if(!ListData) {
    return (<> Loading...</>)}
  if(!genre) {
    return (<> Loading...</>)
  }

  return (
    <section className="max-w-full mx-auto xl:mx-48 md:flex  gap-x-4 px-4 xl:px-0">
      <div className="block md:hidden mb-4">
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ml-1 ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border rounded-full border-gray-100  bg-white focus:ring-red-100 focus:ring-2 outline-none focus:border-base"
            placeholder="Search Name or Job"
            value={searchInput}
            onChange={handleSearchInput}
            required
          />
          <button
            type="submit"
            className="absolute end-0 bottom-0 focus:outline-none text-white bg-base hover:bg-red-600 focus:ring-4 focus:ring-red-400 font-medium  text-sm px-5 py-2.5 me-2 mb-2 flex w-fit items-center rounded-full"
          >
            Search
          </button>
        </div>
      </div>

      <div className="lg:w-5/12">
        <div className="grid grid-cols-1 gap-4">
          {
            currentUser && session && (
          <div className="w-full bg-white rounded-3xl pb-6">
            <Image
              src={currentUser.cover as string}
              unoptimized
              quality={100}
              width={100}
              height={100}
              alt="banner"
              className="w-full rounded-t-3xl"
            />
            <div className="rounded-full overflow-hidden -mt-8 relative w-[60px] h-[60px] ml-4">
              <Image
                src={session?.user?.image as string}
                height={60}
                width={60}
                alt="image"
                className="absolute"
              />
            </div>
            <div className="ml-20 -mt-3">
              <p className="font-medium xl:text-[20px] lg:text-[19px] md:text-[18px] sm:text-[17px] text-black">
                {session?.user?.name}
              </p>
              <p className="font-normal xl:text-[15px] lg:text-[14px] md:text-[13px] sm:text-[12px] text-slate-600">
                {session?.user?.role}
              </p>
            </div>
          </div>
            )
          }
          <div className="w-full px-10 bg-white rounded-3xl py-4">
            <div className="py-4 font-Quicksand xl:text-[20px] lg:text-[19px] md:text-[18px] sm:text-[17px] font-light text-slate-500">
              Manage your File
            </div>
            <div className="flex flex-col">
              <div className="grid grid-cols-1 m-10">
                <button
                  onClick={() => handleButtonFilterClass("All")}
                  className="flex gap-x-4 items-center py-2 hover:bg-slate-100 focus:ring-2 focus:ring-slate-500 rounded-xl mt-2 pl-2"
                >
                  <Image src={setting} width={30} alt="hustler" />
                  <p className="xl:text-[20px] lg:text-[19px] md:text-[18px] sm:text-[17px] font-medium font-Quicksand text-slate-500">
                    All
                  </p>
                </button>
                <div className="flex">
                <TextField
                  type="radio"
                  label="X"
                  name="kelas"
                  checked={classes === "X"}
                  handleChange={() => handleButtonFilterClass("X")}
                  className="flex gap-x-4 m-3 p-4 items-center py-2 hover:bg-slate-100 focus:ring-2 focus:ring-slate-500 rounded-xl mt-2 pl-2"
                />
                <TextField
                  type="radio"
                  label="XI"
                  checked={classes === "XI"}
                  name="kelas"
                  handleChange={() => handleButtonFilterClass("XI")}
                  className="flex gap-x-4 m-3 p-4 items-center py-2 hover:bg-slate-100 focus:ring-2 focus:ring-slate-500 rounded-xl mt-2 pl-2"
                />
                <TextField
                  type="radio"
                  label="XII"
                  name="kelas"
                  checked={classes === "XII"}
                  handleChange={() => handleButtonFilterClass("XII")}
                  className="flex gap-x-4 m-3 p-4 items-center py-2 hover:bg-slate-100 focus:ring-2 focus:ring-slate-500 rounded-xl mt-2 pl-2"
                />
                </div>
              </div>
              <div className="grid grid-cols-1">
                <button
                  onClick={() => handleButtonFilter("All")}
                  className="flex gap-x-4 items-center py-2 hover:bg-slate-100 focus:ring-2 focus:ring-slate-500 rounded-xl mt-2 pl-2"
                >
                  <Image src={setting} width={30} alt="hustler" />
                  <p className="xl:text-[20px] lg:text-[19px] md:text-[18px] sm:text-[17px] font-medium font-Quicksand text-slate-500">
                    All
                  </p>
                </button>
                {filteredGenre.map((data) => (
                  <button
                    key={data}
                    onClick={() => handleButtonFilter(data)}
                    className="flex gap-x-4 items-center py-2 hover:bg-slate-100 focus:ring-2 focus:ring-slate-500 rounded-xl mt-2 pl-2"
                  >
                    <Image src={hipster} width={30} alt={data} />
                    <p className="xl:text-[20px] lg:text-[19px] md:text-[18px] sm:text-[17px] font-medium font-Quicksand text-slate-500">
                      {data}
                    </p>
                  </button>
                ))}
              </div>
            </div>
            <hr />
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="md:block hidden">
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ml-1 ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              className="block w-full p-4 ps-10 text-sm text-gray-900 border rounded-full border-gray-100  bg-white focus:ring-red-100 focus:ring-2 outline-none focus:border-base"
              placeholder="Search Name or Job"
              value={searchInput}
              onChange={handleSearchInput}
              required
            />
            <button
              type="submit"
              className="absolute end-0 bottom-0 focus:outline-none text-white bg-base hover:bg-red-600 focus:ring-4 focus:ring-red-400 font-medium  text-sm px-5 py-2.5 me-2 mb-2 flex w-fit items-center rounded-full"
            >
              Search
            </button>
          </div>
        </div>

        {filteredUser.length != 0 ? (
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 bg-white rounded-xl p-8 mt-4">
            <>
              {filteredUser.map((user, i) => (
                <div
                  key={i}
                  id="container"
                  className="w-full bg-slate-50 rounded-3xl pb-6 border border-slate-200"
                >
                  <Image
                    src={
                      user.coverFile
                        ? (user.coverFile as string)
                        : "https://res.cloudinary.com/dhjeoo1pm/image/upload/v1726727429/mdhydandphi4efwa7kte.png"
                    }
                    unoptimized
                    quality={100}
                    width={100}
                    height={100}
                    alt="banner"
                    className="w-full h-36 rounded-t-3xl"
                  />
                  <div className="ml-8 mt-2">
                    <div className="flex justify-between p-5">
                      <p className="font-medium xl:text-[15px] lg:text-[14px] md:text-[13px] sm:text-[12px] text-[11px] text-black">
                        {user.filename}
                      </p>
                      <p className="font-medium xl:text-[15px] lg:text-[14px] md:text-[13px] sm:text-[12px] text-[11px] text-black">
                        views : {user.views}
                      </p>
                    </div>

                    <div className="mt-6 justify-between flex">
                      <LinkButton
                        variant="white"
                        href={`/ListKarya/user/profile/${user.userId}`}
                        className="bg-transparent border rounded-full"
                      >
                        Profil
                      </LinkButton>
                      <div className="flex gap-x-4">
                        <FormButton
                          variant="base"
                          onClick={() => {
                            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                            user.mimetype.includes("msword") ||
                            user.mimetype.includes(
                              "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            )
                              ? setOpenProfiles(true)
                              : router.push(user.path);
                            addView(user);
                          }}
                          className=" text-blue-500 hover:underline"
                        >
                          Baca
                        </FormButton>
                        <FormButton
                          variant="base"
                          className=" hover:underline"
                          onClick={() => {
                            addLikes(user);
                          }}
                        >
                          Like : {user.Like}
                        </FormButton>
                      </div>
                    </div>
                    {openProfiles && (
                      <ModalProfile
                        title={user.filename}
                        onClose={() => setOpenProfiles(false)}
                        className="h-screen"
                      >
                        <iframe
                          className="w-full h-full"
                          src={`${user.path}&output=embed`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          sandbox="allow-scripts allow-modals allow-popups allow-presentation allow-same-origin"
                          allowFullScreen
                        ></iframe>
                      </ModalProfile>
                    )}
                  </div>
                </div>
              ))}
            </>
          </div>
        ) : (
          <div className="bg-white px-2 py-10">
            <h1 className="text-center text-[20px] mx-auto">
              Oops! Data Tidak Ditemukan
            </h1>
          </div>
        )}
      </div>
    </section>
  );
}
