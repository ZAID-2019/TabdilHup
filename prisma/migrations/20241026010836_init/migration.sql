-- AlterTable
ALTER TABLE "items" ADD COLUMN     "cityId" INTEGER,
ADD COLUMN     "countryId" INTEGER;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;
