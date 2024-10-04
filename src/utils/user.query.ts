import {  Prisma,  } from "@prisma/client";
import prisma from "./../lib/prisma";


export const findAllUsers = async (filter?: Prisma.UserWhereInput) => {
  return await prisma.user.findMany({
    where: filter,
    include: { userAuth: { select: { last_login: true } }, File:true},
  });
};

export const findUser = async (filter: Prisma.UserWhereInput) => {
  return await prisma.user.findFirst({
    where: filter,
    include: { userAuth: { select: { last_login: true } }, File: true },
  });
};


export const findUserAuth = async (email: string) => {
  return await prisma.userAuth.findUnique({ where: { userEmail: email } });
};



export const createUser = async (data: Prisma.UserUncheckedCreateInput) => {
  return await prisma.user.create({ data });
};

export const findFiles=async(filter: Prisma.fileWorkWhereInput) => {
  return await prisma.fileWork.findMany({
    where: filter,
    include: { user:true},
  });
}

export const createFile = async (data: Prisma.fileWorkUncheckedCreateInput) => {
  return await prisma.fileWork.create({ data});
};
export const updateUser = async (where: Prisma.UserWhereUniqueInput, update: Prisma.UserUncheckedUpdateInput) => {
  return await prisma.user.update({ where, data: update });
};

export const updateUserAuth = async (where: Prisma.UserAuthWhereUniqueInput, update: Prisma.UserAuthUncheckedUpdateInput) => {
  return await prisma.userAuth.update({ where, data: update });
};

export const deleteUser = async (user_id: string) => {
  return await prisma.user.delete({ where: { id: user_id } });
};

