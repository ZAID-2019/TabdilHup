/*
  Warnings:

  - You are about to drop the column `image_public_id` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `subscriptions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "image_public_id",
DROP COLUMN "image_url";
