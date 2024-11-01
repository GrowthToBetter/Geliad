/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";
import Link from "next/link";
import Image from "next/image";
import { FormButton, LinkButton } from "./Button";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import ModalProfile from "./Modal";

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
  const [tutorial, setTutorial] = useState<boolean>(
    pathName === "/" ? true : false
  );

  const { data: session, status } = useSession();
  return (
    <main>
      <nav className="bg-Secondary fixed w-full z-20 top-0 start-0 border-b border-gray-200">
        <div className="min-w-max flex flex-wrap items-center justify-between mx-auto p-4 lg:px-20">
          <div className="w-fit h-fit flex-col justify-center items-center space-x-72"></div>
          <Link
            href="#"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <div>
              <h1 className="tracking-[1.5rem] text-2xl text-white font-bold">
                GELIAD
                <p className="text-center text-sm font-normal text-white tracking-widest">
                  Menciptakan generasi hebat, Dari tugas Jadi karya
                </p>
              </h1>
            </div>
          </Link>
          {tutorial && (
            <ModalProfile
              onClose={() => {
                setTutorial(false);
              }}
              title="Panduan"
            >
              <div>
                <ul>
                  <li>1. Daftar Melalui Admin sekolah masing masing</li>
                  <li>
                    2. Apabila belum memiliki admin, bergabung sekarang bersama
                    kami
                  </li>
                  <li>
                    3. Setelah melakukan pendaftaran, login dengan akun yang
                    didaftarkan
                  </li>
                  <li>4. update profile</li>
                  <li>5. Ajukan Karya yang Diinginkan</li>
                  <li>
                    6. Proses Pengajuan dilakukan dengan menentukan jenis karya
                    yang ingin diupload
                  </li>
                  <li>
                    7. Apabila memilih Upload File, Pilih genre file terlebih
                    dahulu, Lalu Baru pilih file yang akan diupload
                  </li>
                  <li>
                    8. Setelah Upload Succes, tutup tab upload dan tambahkan
                    cover
                  </li>
                  <li>
                    9. Apabila Jenis file adalah link, isi sesuai format yang
                    disediakan, setelah selesai tambahkan cover seperti diatas
                  </li>
                  <li>
                    10. Tunggu Validator untuk memverifikasi karya yang telah
                    diupload
                  </li>
                  <li>
                    11. Lihat pada bagian notifikasi apabila terdapat komentar,
                    atau melihat status terbaru dari karya
                  </li>
                  <li>
                    12. Karya yang telah diverifikasi bisa dilihat pada List
                    Karya yang diakses dari halaman Home atau Navbar Karya
                  </li>
                  <li>
                    13. Karya Yang berupa word atau docs dapat dibaca On Page,
                    sedangkan pdf atau Image akan ter- Redirect ke lokasi file
                    disimpan
                  </li>
                </ul>
                <div className="h-32 w-full invisible"></div>
              </div>
            </ModalProfile>
          )}
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <FormButton
              variant="base"
              onClick={() => {
                setTutorial(true);
              }}
            >
              Panduan
            </FormButton>
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
                    <div className="flex gap-x-3 items-center">
                      <svg
                        aria-hidden="true"
                        className="inline w-5 h-5 animate-spin text-blue-900 fill-white"
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
                    </div>
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
                          <FormButton
                            variant="base"
                            onClick={() => router.push("/profile")}
                            className="w-full mx-auto text-sm text-center "
                          >
                            Profile
                          </FormButton>
                          <FormButton
                            onClick={() => signOut({ callbackUrl: "/signin" })}
                            variant="base"
                            className="w-full mx-auto text-sm text-black border-t-2 border-Primary"
                          >
                            Sign Out
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
                            : "text-white"
                        } rounded-md hover:text-blue-600 hover:border-2 p-2 hover:border-Secondary`}
                      >
                        Beranda
                      </Link>
                    </li>
                    {session?.user?.email && (
                      <li>
                        <Link
                          href="/AjukanKarya"
                          className={`${
                            pathName === "/AjukanKarya"
                              ? "text-black border-2 border-Secondary"
                              : "text-white"
                          } rounded-md hover:text-blue-600 hover:border-2 p-2 `}
                        >
                          Ajukan Karya
                        </Link>
                      </li>
                    )}
                    <li>
                      <Link
                        href="/ListKarya"
                        className={`${
                          pathName === "/ListKarya"
                            ? "text-black border-2 border-Secondary"
                            : "text-white"
                        } rounded-md hover:text-blue-600 hover:border-2 p-2 `}
                      >
                        List Karya
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/pengembang"
                        className={`${
                          pathName === "/pengembang"
                            ? "text-blue-400 border-2 border-highlight"
                            : "text-black"
                        } rounded-md hover:text-blue-600 hover:border-2 p-2 `}
                      >
                        Developers
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
                      : "text-white"
                  } rounded-md  hover:text-black  hover:bg-white duration-200 hover:border-2 p-2 `}
                >
                  Beranda
                </Link>
              </li>
              {session?.user?.email && (
                <li>
                  <Link
                    href="/AjukanKarya"
                    className={`${
                      pathName === "/AjukanKarya"
                        ? "text-black border-2 bg-white border-Primary"
                        : "text-white"
                    } rounded-md hover:text-black hover:bg-white duration-200 hover:border-2 p-2 `}
                  >
                    Ajukan Karya
                  </Link>
                </li>
              )}
              <li>
                <Link
                  href="/ListKarya"
                  className={`${
                    pathName === "/ListKarya"
                      ? "text-black border-2 bg-white border-Primary"
                      : "text-white"
                  } rounded-md hover:text-black hover:bg-white duration-200 hover:border-2 p-2 `}
                >
                  List Karya
                </Link>
              </li>
              <li>
                <Link
                  href="/pengembang"
                  className={`${
                    pathName === "/pengembang"
                      ? "text-highlight border-2 bg-white border-highlight"
                      : "text-white"
                  } rounded-md hover:text-highlight hover:bg-white duration-200 hover:border-2 p-2 `}
                >
                  Developers
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </main>
  );
}
