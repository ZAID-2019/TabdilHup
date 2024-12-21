-- AlterTable
ALTER TABLE "items" ADD COLUMN     "subcategory_id" TEXT;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_subcategory_id_fkey" FOREIGN KEY ("subcategory_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
