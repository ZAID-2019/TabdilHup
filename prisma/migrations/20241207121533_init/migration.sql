/*
  Warnings:

  - The primary key for the `banners` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `cities` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `countries` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `item_images` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `items` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `subscription_options` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `subscriptions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `user_subscriptions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `activity_logs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "activity_logs" DROP CONSTRAINT "activity_logs_item_id_fkey";

-- DropForeignKey
ALTER TABLE "activity_logs" DROP CONSTRAINT "activity_logs_user_id_fkey";

-- DropForeignKey
ALTER TABLE "banners" DROP CONSTRAINT "banners_item_id_fkey";

-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "cities" DROP CONSTRAINT "cities_country_id_fkey";

-- DropForeignKey
ALTER TABLE "item_images" DROP CONSTRAINT "item_images_item_id_fkey";

-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_category_id_fkey";

-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_city_id_fkey";

-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_country_id_fkey";

-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_user_id_fkey";

-- DropForeignKey
ALTER TABLE "subscription_options" DROP CONSTRAINT "subscription_options_subscriptions_id_fkey";

-- DropForeignKey
ALTER TABLE "user_subscriptions" DROP CONSTRAINT "user_subscriptions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_city_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_country_id_fkey";

-- AlterTable
ALTER TABLE "banners" DROP CONSTRAINT "banners_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "item_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "banners_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "banners_id_seq";

-- AlterTable
ALTER TABLE "categories" DROP CONSTRAINT "categories_pkey",
ADD COLUMN     "icon" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "parent_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "categories_id_seq";

-- AlterTable
ALTER TABLE "cities" DROP CONSTRAINT "cities_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "country_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "cities_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "cities_id_seq";

-- AlterTable
ALTER TABLE "countries" DROP CONSTRAINT "countries_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "countries_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "countries_id_seq";

-- AlterTable
ALTER TABLE "item_images" DROP CONSTRAINT "item_images_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "item_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "item_images_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "item_images_id_seq";

-- AlterTable
ALTER TABLE "items" DROP CONSTRAINT "items_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "city_id" SET DATA TYPE TEXT,
ALTER COLUMN "country_id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ALTER COLUMN "category_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "items_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "items_id_seq";

-- AlterTable
ALTER TABLE "subscription_options" DROP CONSTRAINT "subscription_options_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "subscriptions_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "subscription_options_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "subscription_options_id_seq";

-- AlterTable
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "subscriptions_id_seq";

-- AlterTable
ALTER TABLE "user_subscriptions" DROP CONSTRAINT "user_subscriptions_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "user_subscriptions_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "user_subscriptions_id_seq";

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "city_id" SET DATA TYPE TEXT,
ALTER COLUMN "country_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "users_id_seq";

-- DropTable
DROP TABLE "activity_logs";

-- DropEnum
DROP TYPE "ActivityLogAction";

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_images" ADD CONSTRAINT "item_images_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banners" ADD CONSTRAINT "banners_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_options" ADD CONSTRAINT "subscription_options_subscriptions_id_fkey" FOREIGN KEY ("subscriptions_id") REFERENCES "subscriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cities" ADD CONSTRAINT "cities_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
