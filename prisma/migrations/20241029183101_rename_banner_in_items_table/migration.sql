/*
  Warnings:

  - You are about to drop the column `is_panner` on the `items` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "items" DROP COLUMN "is_panner",
ADD COLUMN     "is_banner" BOOLEAN NOT NULL DEFAULT false;
