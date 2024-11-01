-- AlterTable
ALTER TABLE `User` ADD COLUMN `SchoolOrigin` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `fileWork` ADD COLUMN `userClasses` ENUM('X', 'XI', 'XII') NULL;
