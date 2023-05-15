/*
  Warnings:

  - You are about to alter the column `date` on the `event` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `event` MODIFY `date` TIMESTAMP NOT NULL;

-- CreateTable
CREATE TABLE `user_service_id` (
    `user_id` INTEGER NOT NULL,
    `service_id` INTEGER NOT NULL,
    `is_visible` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`user_id`, `service_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `service` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `date` TIMESTAMP NOT NULL,
    `price` DECIMAL(7, 2) NOT NULL,
    `latitude` DECIMAL(7, 5) NOT NULL,
    `longitude` DECIMAL(8, 5) NOT NULL,
    `slotsAvailable` INTEGER NOT NULL,
    `picture_path` VARCHAR(255) NULL,
    `is_notifications_on` BOOLEAN NOT NULL DEFAULT false,
    `is_public` BOOLEAN NOT NULL DEFAULT true,
    `publish_date` TIMESTAMP(1) NOT NULL DEFAULT CURRENT_TIMESTAMP(1),
    `company_id` INTEGER NOT NULL,

    UNIQUE INDEX `service_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_service_id` ADD CONSTRAINT `user_service_id_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_service_id` ADD CONSTRAINT `user_service_id_service_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `service`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service` ADD CONSTRAINT `service_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
