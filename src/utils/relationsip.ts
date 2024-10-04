import { Prisma } from "@prisma/client";

export type userWithLastLogin = Prisma.UserGetPayload<{
  include: { userAuth: { select: { last_login: true} }};
}>;

export type userFullPayload = Prisma.UserGetPayload<{
  include: {userAuth: true}
}>;
export type FileFullPayload = Prisma.fileWorkGetPayload<{
  include: {user: true}
}>;


