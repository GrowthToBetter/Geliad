-- AlterTable
ALTER TABLE `User` MODIFY `role` ENUM('SISWA', 'GURU', 'ADMIN', 'VALIDATOR', 'DELETE') NOT NULL DEFAULT 'SISWA';

-- AlterTable
ALTER TABLE `fileWork` MODIFY `userRole` ENUM('SISWA', 'GURU', 'ADMIN', 'VALIDATOR', 'DELETE') NOT NULL DEFAULT 'SISWA';
