/*
  Warnings:

  - You are about to alter the column `date` on the `event` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `date` on the `service` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to drop the `user_service_id` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `user_service_id` DROP FOREIGN KEY `user_service_id_service_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_service_id` DROP FOREIGN KEY `user_service_id_user_id_fkey`;

-- AlterTable
ALTER TABLE `event` MODIFY `date` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `service` MODIFY `date` TIMESTAMP NOT NULL;

-- DropTable
DROP TABLE `user_service_id`;

-- CreateTable
CREATE TABLE `user_service` (
    `user_id` INTEGER NOT NULL,
    `service_id` INTEGER NOT NULL,
    `is_visible` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`user_id`, `service_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_service` ADD CONSTRAINT `user_service_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_service` ADD CONSTRAINT `user_service_service_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `service`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
