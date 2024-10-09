/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FormButton } from "@/app/components/utils/Button";
import { useRouter } from "next/navigation";
import {
  updateIdentity,
} from "@/utils/server-action/userGetServerSession";
import { Class, Title } from "@prisma/client";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { DropDown } from "@/app/components/utils/Form";
import { userFullPayload } from "@/utils/relationsip";
import useSWR from "swr";
import { fetcher } from "@/utils/server-action/Fetcher";

export default function PilihKeahlian() {
  const { data: session, status } = useSession();
  const [selectedClass, setSelectedClass] = useState<{ [key: string]: string }>(
    {}
  );
  const [selectedSpecialist, setSelectedSpecialist] = useState<{
    [key: string]: string;
  }>({});
  const [userData, setUserData] = useState<userFullPayload | null>(null);

  const router = useRouter();

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
  }, [session, userData]);

  const handleRoleChangeClass = (userId: string, newClass: string) => {
    setSelectedClass((prev) => ({
      ...prev,
      [userId]: newClass,
    }));
  };

  const handleRoleChangeSpecialist = (
    userId: string,
    newSpecialist: string
  ) => {
    setSelectedSpecialist((prev) => ({
      ...prev,
      [userId]: newSpecialist,
    }));
  };


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const toastID = toast.loading("Loading ...");

      for (const userId in selectedClass) {
        if(userData?.role==="SISWA") formData.set("Class", selectedClass[userId]);
        else formData.set("Class", "");
      }
      for (const userId in selectedSpecialist) {
        formData.set("Specialist", selectedSpecialist[userId]);
      }
      if (userData?.id) {
        await updateIdentity(userData.id, formData);
        toast.success("Identity updated successfully!", { id: toastID });
      }
      router.push("/profile");
    } catch (error) {
      toast.error("Failed to update Identity!");
      throw new Error((error as Error).message);
    }
  };

  return (
    <React.Fragment>
      <main className="flex max-w-full w-full h-screen items-center justify-center">
        <div className="w-1/2 h-full pt-24">
          <div className="max-w-2xl mx-auto mt-12">
            <h3 className="text-[32px] font-medium text-black">
              What are You?
            </h3>
            <p className="text-[20px] font-medium text-black opacity-70 -mt-2">
              Decide what you want to be
            </p>
            <form onSubmit={handleSubmit}>
              <div className="flex items-center w-fit m-5 justify-between p-3 bg-white drop-shadow rounded-[12px]">
                <p className="lg:text-lg text-md font-bold w-fit mx-5">
                  {userData?.name}
                </p>
                <p className="lg:text-lg text-md font-bold w-fit mx-5">
                  {userData?.role}
                </p>
                <div className="flex items-center">
                  {userData?.role==="SISWA" ? 
                  <DropDown
                    label="Class"
                    options={Object.values(Class).map((classes) => ({
                      label: classes,
                      value: classes,
                    }))}
                    className="rounded-xl flex justify-center items-center bg-moklet text-black p-3 m-3 font-bold"
                    name="classes"
                    value={
                      selectedClass[userData?.id || ""] ||
                      userData?.clasess ||
                      undefined
                    }
                    handleChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      handleRoleChangeClass(userData?.id || "", e.target.value)
                    }
                  />:""
                }
                  <DropDown
                    label="Specialist"
                    options={Object.values(Title).map((special) => ({
                      label: special,
                      value: special,
                    }))}
                    className="rounded-xl flex justify-center items-center bg-moklet text-black p-3 m-3 font-bold"
                    name="specialist"
                    value={
                      selectedSpecialist[userData?.id || ""] ||
                      userData?.title ||
                      undefined
                    }
                    handleChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      handleRoleChangeSpecialist(
                        userData?.id || "",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
              <FormButton type="submit" variant="base">
                Submit
              </FormButton>
            </form>
          </div>
        </div>
      </main>
    </React.Fragment>
  );
}
