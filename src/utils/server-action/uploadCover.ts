/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { nextGetServerSession } from "@/lib/authOption";
import { UploadImageCloudinary, UploadImageCloudinaryFile } from "../uploadImage";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export const InsertFileUpload = async (data: Record<string, any>) => {
  try {
    const insert = await UploadImageCloudinary(Buffer.from(data.data));
    return insert;
  } catch (error) {
    console.log(error);
    throw new Error((error as Error).message);
  }
};

export const UpdateCoverFile = async (id:string, data: FormData) => {
  try {
    const session = await nextGetServerSession();
    if (!session?.user) {
      return { status: 401, message: "Auth Required" };
    }
    const cover = data.get("cover") as File;
    const ArrayBuffer = await cover.arrayBuffer();
    const upload = await UploadImageCloudinaryFile(Buffer.from(ArrayBuffer));
    const update = await prisma.fileWork.update({
      where: { id: id },
      data: {
        coverFile: upload.data?.url as string,
      },
    });
    if (!update) {
      return { status: false, message: "Failed to update Cover" };
    }
    revalidatePath("/");
    return { status: true, message: "Success to update Cover" };
  } catch (error) {
    console.log(error);
    throw new Error((error as Error).message);
  }
};
export const UpdateCoverProfile = async (data: FormData) => {
  try {
    const session = await nextGetServerSession();
    if (!session?.user) {
      return { status: 401, message: "Auth Required" };
    }
    const cover = data.get("cover") as File;
    const ArrayBuffer = await cover.arrayBuffer();
    const upload = await UploadImageCloudinary(Buffer.from(ArrayBuffer));
    const update = await prisma.user.update({
      where: { id: session.user.id as string },
      data: {
        cover: upload.data?.url as string,
      },
    });
    if (!update) {
      return { status: false, message: "Failed to update Photo Profile" };
    }
    revalidatePath("/profile");
    return { status: true, message: "Success to update Photo Profile" };
  } catch (error) {
    console.log(error);
    throw new Error((error as Error).message);
  }
};

