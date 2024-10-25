/*
  Warnings:

  - Made the column `Genre` on table `Genre` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Genre` MODIFY `Genre` VARCHAR(191) NOT NULL;
