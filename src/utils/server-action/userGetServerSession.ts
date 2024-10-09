/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { Class,  Gender, RequestStatus, Role, Status, Title } from "@prisma/client";
import prisma from "@/lib/prisma";
import { createUser, updateUser } from "../user.query";
import { revalidatePath } from "next/cache";
import { nextGetServerSession } from "@/lib/authOption";
import { hash } from "bcrypt";

export const UpdateUserById = async (data: FormData) => {
  try {
    const session = await nextGetServerSession();

    const id = session?.user?.id;

    const email = data.get("email") as string;
    const photo_profile = data.get("photo_profile") as string;
    const name = data.get("name") as string;
    const role = data.get("role") as Role;
    const clasess = data.get("clasess") as Class;
    const absent = data.get("absent") as string;
    const Phone = data.get("Phone") as string;
    const status = data.get("status") as Status;
    const title = data.get("specialist") as Title;
    const gender = data.get("gender") as Gender;
    if (!id) {
      const create = await createUser({
        email,
        photo_profile,
        name,
        role,
        clasess,
        absent,
        Phone,
        status,
        title,
        gender,
      });
      if (!create) throw new Error("Failed to create");
    } else if (id) {
      const findUserWithId = await prisma.user.findUnique({
        where: { id },
      });
      const update = await updateUser(
        { id: id ?? findUserWithId?.id },
        {
          email: email ?? findUserWithId?.email,
          name: name ?? findUserWithId?.name,
          absent: absent ?? findUserWithId?.absent,
          clasess: clasess ?? findUserWithId?.clasess,
          Phone: Phone ?? findUserWithId?.Phone,
          gender: gender ?? findUserWithId?.gender,
          role: role ?? findUserWithId?.role,
          title: title ?? findUserWithId?.title,
          status: status ?? findUserWithId?.status,
          photo_profile: photo_profile ?? findUserWithId?.photo_profile,
        }
      );
      if (!update) throw new Error("Update failed");
    } else {
      throw new Error("Email already exists");
    }
    revalidatePath("/profile");
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const updateIdentity = async (id: string, data: FormData) => {
  try {
    const session = await nextGetServerSession();
    if (!session) {
      throw new Error("eror");
    }

    const clasess = data.get("Class") as Class;
    const Title = data.get("Specialist") as Title;
    const update = await prisma.user.update({
      where: { id: id },
      data: {
        clasess,
        title: Title,
      },
    });
    if (!update) {
      throw new Error("eror");
    }
    revalidatePath("/pilihRole");
    revalidatePath("/");
    revalidatePath("/profile");
    revalidatePath("/notification");
    revalidatePath("/AjukanKarya");
    return update;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const commentFile=async (comment: string, file:{connect:{id:string}}, user:{connect:{id:string}}) => {
  try {
    const createComment = await prisma.comment.create({
      data: {
        file,
        user:{
          connect:{
            id:user.connect.id
          }
        },
        Text: comment,
      }
    })
    if(!createComment){
      throw new Error("eror");
    }
    return createComment;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export const updateStatus = async (id: string, data: FormData) => {
  try {
    const status = data.get("status") as RequestStatus;
    const update= await prisma.fileWork.update({
      where: { id: id },
      data: {
        status
      },
    })
    if(!update){
      throw new Error("eror");
    }
    revalidatePath("/AjukanKarya");
    return update;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export const UpdateUserByIdInAdmin = async (id: string, data: FormData) => {
  try {
    const session = await nextGetServerSession();
    if (!session?.user) {
      return { status: 401, message: "Auth Required" };
    }
    if (session?.user.role !== "ADMIN") {
      return { status: 401, message: "Unauthorize" };
    }
    const email = data.get("email") as string;
    const name = data.get("name") as string;
    const password = data.get("password") as string;
    const role = data.get("role") as Role;

    const findEmail = await prisma.user.findUnique({
      where: { email },
      include: { userAuth: true },
    });

    if (!findEmail && id == null) {
      const create = await prisma.user.create({
        data: {
          email,
          name,
          role,
          userAuth: {
            create: {
              password: await hash(password, 10),
              last_login: new Date(),
            },
          },
        },
      });
      if (!create) throw new Error("Failed to create admin!");
      revalidatePath("/admin");
      return { status: 200, message: "Create Success!" };
    } else if (id) {
      const findUser = await prisma.user.findFirst({
        where: { id },
        include: { userAuth: true },
      });
      if (findUser) {
        const update = await prisma.user.update({
          where: { id: id ?? findUser?.id },
          data: {
            name: name ?? findUser?.name,
            email: email ?? findUser?.email,
            role: role ?? (findUser?.role as Role),
            userAuth: {
              update: {
                last_login: new Date(),
              },
            },
          },
        });
        console.log(update);
        if (!update) throw new Error("Failed to update admin!");
        revalidatePath("/admin");
        return { status: 200, message: "Update Success!" };
      } else throw new Error("User not found!");
    }
    revalidatePath("/admin");
    return { status: 200, message: "Update Success!" };
  } catch (error) {
    console.error("Error update user:", error);
    throw new Error((error as Error).message);
  }
};

export const UpdateAdminById = async (id: string, data: FormData) => {
  try {
    const session = await nextGetServerSession();
    if (!session?.user) {
      return { status: 401, message: "Auth Required" };
    }
    if (session?.user.role !== "ADMIN") {
      return { status: 401, message: "Unauthorize" };
    }
    const email = data.get("email") as string;
    const name = data.get("name") as string;
    const password = data.get("password") as string;
    const role = data.get("role") as Role;

    const findEmail = await prisma.user.findUnique({
      where: { email },
      include: { userAuth: true },
    });

    if (!findEmail && id == null) {
      const create = await prisma.user.create({
        data: {
          email,
          name,
          role,
          userAuth: {
            create: {
              password: await hash(password, 10),
              last_login: new Date(),
            },
          },
        },
      });
      if (!create) throw new Error("Failed to create admin!");
      revalidatePath("/admin");
      return { status: 200, message: "Create Success!" };
    } else if (id) {
      const findUser = await prisma.user.findFirst({
        where: { id },
        include: { userAuth: true },
      });
      if (findUser) {
        const update = await prisma.user.update({
          where: { id: id ?? findUser?.id },
          data: {
            name: name ?? findUser?.name,
            email: email ?? findUser?.email,
            role: role ?? (findUser?.role as Role),
            userAuth: {
              update: {
                last_login: new Date(),
              },
            },
          },
        });
        console.log(update);
        if (!update) throw new Error("Failed to update admin!");
        revalidatePath("/admin");
        return { status: 200, message: "Update Success!" };
      } else throw new Error("User not found!");
    }
    revalidatePath("/admin");
    return { status: 200, message: "Update Success!" };
  } catch (error) {
    console.error("Error update user:", error);
    throw new Error((error as Error).message);
  }
};

export const DeleteUser = async (id: string) => {
  try {
    const session = await nextGetServerSession();
    if (!session?.user) {
      return { status: 401, message: "Auth Required" };
    }
    if (session?.user.role === "SISWA") {
      return { status: 401, message: "Unauthorize" };
    }
    const del = await prisma.user.delete({
      where: { id },
    });
    if (!del) {
      return { status: 400, message: "Failed to delete user!" };
    }
    revalidatePath("/admin/studentData");
    revalidatePath("/admin");
    return { status: 200, message: "Delete Success!" };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error((error as Error).message);
  }
};

export const updateRole = async (id: string, data: FormData) => {
  try {
    const session = await nextGetServerSession();
    if (!session) {
      throw new Error("eror");
    }

    const role = data.get("role") as Role;
    const update = await prisma.user.update({
      where: { id: id },
      data: {
        role,
      },
    });
    if (!update) {
      throw new Error("eror");
    }
    revalidatePath("/admin/studentData");
    revalidatePath("/pilihRole");
    return update;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const UpdateGeneralProfileById = async (data: FormData) => {
  try {
    const session = await nextGetServerSession();

    const id = session?.user?.id;

    const email = data.get("email") as string;
    const photo_profile = data.get("photo_profile") as string;
    const name = data.get("name") as string;
    const role = data.get("role") as Role;
    const clasess = data.get("clasess") as Class;
    const absent = data.get("absent") as string;
    const Phone = data.get("Phone") as string;
    const ClassNumber = data.get("classDetail") as string;
    const status = data.get("status") as Status;
    const gender = data.get("gender") as Gender;

    if (!id) {
      const create = await createUser({
        email,
        photo_profile,
        name,
        role,
        clasess,
        absent,
        ClassNumber,
        Phone,
        status,
        gender,
      });
      if (!create) throw new Error("Failed to create");
    } else if (id) {
      const findUserWithId = await prisma.user.findUnique({
        where: { id },
      });

      const update = await updateUser(
        { id: id ?? findUserWithId?.id },
        {
          email: email ?? findUserWithId?.email,
          name: name ?? findUserWithId?.name,
          absent: absent ?? findUserWithId?.absent,
          clasess: clasess ?? findUserWithId?.clasess,
          ClassNumber: ClassNumber ?? findUserWithId?.ClassNumber,
          Phone: Phone ?? findUserWithId?.Phone,
          role: role ?? findUserWithId?.role,
          status: status ?? findUserWithId?.status,
          photo_profile: photo_profile ?? findUserWithId?.photo_profile,
        }
      );
      if (!update) throw new Error("Update failed");
    } else {
      throw new Error("Email already exists");
    }
    revalidatePath("/profile");
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};
