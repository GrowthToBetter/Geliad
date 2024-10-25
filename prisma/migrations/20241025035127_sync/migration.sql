-- AlterTable
ALTER TABLE `fileWork` ADD COLUMN `permisionId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Genre` (
    `comment_id` CHAR(36) NOT NULL,
    `Genre` VARCHAR(191) NULL,

    PRIMARY KEY (`comment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
