import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient;

  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
    }
  }
}

declare module 'react-docx';
