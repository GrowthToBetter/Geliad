/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";
import Link from "next/link";
import Image from "next/image";
import { FormButton, LinkButton } from "./Button";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const [modal, setModal] = useState<boolean>(false);
  const [prof, setprof] = useState<boolean>(false);

  const handleProf = () => {
    prof ? setprof(false) : setprof(true);
  };
  const handleClick = () => {
    setModal(!modal);
  };

  const pathName = usePathname();
  const router = useRouter();

  const { data: session, status } = useSession();
  return (
    <main>
      <nav className="bg-Primary fixed w-full z-20 top-0 start-0 border-b border-gray-200">
        <div className="min-w-max flex flex-wrap items-center justify-between mx-auto p-4 lg:px-20">
          <div className="w-fit h-fit flex-col justify-center items-center space-x-72"></div>
          <Link
            href="#"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <div>
              <h1 className="tracking-[3rem] text-2xl font-bold">
                GELIAD
                <p className="text-center text-sm font-normal tracking-widest">
                  Dari Tugas Jadi Karya
                </p>
              </h1>
            </div>
          </Link>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <div>
              {status === "unauthenticated" ? (
                <button
                  onClick={() => signIn()}
                  className="focus:outline-none text-black bg-Primariy hover:bg-slate-100 focus:ring focus:ring-slate-100 font-medium rounded-full border border-slate-300 text-sm px-5 py-2.5 me-2 mb-2"
                >
                  Sign In
                </button>
              ) : (
                <>
                  {status === "loading" ? (
                    <></>
                  ) : (
                    <div className="">
                      <FormButton
                        type="button"
                        variant="base"
                        onClick={handleProf}
                        withArrow
                        className="flex justify-center gap-x-2 py-2 px-4 "
                      >
                        <Image
                          src={session?.user?.image as string}
                          alt="user image"
                          width={36}
                          height={36}
                          className="rounded-full"
                        />
                      </FormButton>
                      {prof && (
                        <div className="w-full p-2 max-w-56 bg-Secondary mt-1 border border-slate-300 rounded-lg fixed right-12 top-24 inline-block">
                          <LinkButton
                            variant="base"
                            href="/profile"
                            className="w-full"
                          >
                            <p className="mx-auto text-sm">Profile</p>
                          </LinkButton>
                          <FormButton
                            onClick={() => signOut({ callbackUrl: "/signin" })}
                            variant="base"
                            className="w-full"
                          >
                            <p className="mx-auto text-sm text-black border-t-2 border-Primary">
                              Sign Out
                            </p>
                          </FormButton>
                          <FormButton
                            variant="base"
                            className="w-full"
                            onClick={() =>
                              router.push("/profile/notification/Karya")
                            }
                          >
                            Notification
                          </FormButton>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
            <button
              data-collapse-toggle="navbar-sticky"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-Secondary focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400"
              aria-controls="navbar-sticky"
              aria-expanded="false"
              onClick={handleClick}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
            <div>
              {modal && (
                <div className="flex mt-10 text-center md:hidden">
                  <ul className="fixed left-0 mt-4 w-screen border-y bg-white border-slate-300 bg-Secondary-1000 py-14 space-y-14">
                    <li>
                      <Link
                        href="/"
                        className={`${
                          pathName === "/"
                            ? "text-black border-2 border-Secondary"
                            : "text-black"
                        } rounded-md hover:text-blue-600 hover:border-2 p-2 hover:border-Secondary`}
                      >
                        Beranda
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/AjukanKarya"
                        className={`${
                          pathName === "/AjukanKarya"
                            ? "text-black border-2 border-Secondary"
                            : "text-black"
                        } rounded-md hover:text-blue-600 hover:border-2 p-2 `}
                      >
                        Ajukan Karya
                      </Link>
                    </li>
                    <li className="flex justify-center"></li>
                  </ul>
                  <div></div>
                </div>
              )}
            </div>
          </div>
          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-sticky"
          >
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-md-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 opacity-80">
              <li>
                <Link
                  href="/"
                  className={`${
                    pathName === "/"
                      ? "text-black border-2 bg-white border-Primary"
                      : "text-black"
                  } rounded-md  hover:text-black  hover:bg-white duration-200 hover:border-2 p-2 `}
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/AjukanKarya"
                  className={`${
                    pathName === "/AjukanKarya"
                      ? "text-black border-2 bg-white border-Primary"
                      : "text-black"
                  } rounded-md hover:text-black hover:bg-white duration-200 hover:border-2 p-2 `}
                >
                  Ajukan Karya
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </main>
  );
}
