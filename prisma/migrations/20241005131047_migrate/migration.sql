-- AlterTable
ALTER TABLE `User` ADD COLUMN `validatorId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `_task_validator` (
    `A` CHAR(36) NOT NULL,
    `B` CHAR(36) NOT NULL,

    UNIQUE INDEX `_task_validator_AB_unique`(`A`, `B`),
    INDEX `_task_validator_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_validatorId_fkey` FOREIGN KEY (`validatorId`) REFERENCES `User`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_task_validator` ADD CONSTRAINT `_task_validator_A_fkey` FOREIGN KEY (`A`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_task_validator` ADD CONSTRAINT `_task_validator_B_fkey` FOREIGN KEY (`B`) REFERENCES `fileWork`(`file_id`) ON DELETE CASCADE ON UPDATE CASCADE;
