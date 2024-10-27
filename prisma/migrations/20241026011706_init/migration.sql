/*
  Warnings:

  - You are about to drop the column `cityId` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `countryId` on the `items` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_cityId_fkey";

-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_countryId_fkey";

-- AlterTable
ALTER TABLE "items" DROP COLUMN "cityId",
DROP COLUMN "countryId";

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
