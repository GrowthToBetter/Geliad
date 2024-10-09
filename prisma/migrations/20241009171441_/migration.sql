/*
  Warnings:

  - You are about to drop the `_comment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_comment` DROP FOREIGN KEY `_comment_A_fkey`;

-- DropForeignKey
ALTER TABLE `_comment` DROP FOREIGN KEY `_comment_B_fkey`;

-- AlterTable
ALTER TABLE `comment` ADD COLUMN `userId` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `_comment`;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;
