-- AlterTable
ALTER TABLE `User` MODIFY `role` ENUM('SISWA', 'GURU', 'ADMIN', 'VALIDATOR') NOT NULL DEFAULT 'SISWA';

-- AlterTable
ALTER TABLE `fileWork` ADD COLUMN `userRole` ENUM('SISWA', 'GURU', 'ADMIN', 'VALIDATOR') NOT NULL DEFAULT 'SISWA';
