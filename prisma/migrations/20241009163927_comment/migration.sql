-- CreateTable
CREATE TABLE `comment` (
    `comment_id` CHAR(36) NOT NULL,

    PRIMARY KEY (`comment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_comment` (
    `A` CHAR(36) NOT NULL,
    `B` CHAR(36) NOT NULL,

    UNIQUE INDEX `_comment_AB_unique`(`A`, `B`),
    INDEX `_comment_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_comment_file` (
    `A` CHAR(36) NOT NULL,
    `B` CHAR(36) NOT NULL,

    UNIQUE INDEX `_comment_file_AB_unique`(`A`, `B`),
    INDEX `_comment_file_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_comment` ADD CONSTRAINT `_comment_A_fkey` FOREIGN KEY (`A`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_comment` ADD CONSTRAINT `_comment_B_fkey` FOREIGN KEY (`B`) REFERENCES `comment`(`comment_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_comment_file` ADD CONSTRAINT `_comment_file_A_fkey` FOREIGN KEY (`A`) REFERENCES `comment`(`comment_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_comment_file` ADD CONSTRAINT `_comment_file_B_fkey` FOREIGN KEY (`B`) REFERENCES `fileWork`(`file_id`) ON DELETE CASCADE ON UPDATE CASCADE;
