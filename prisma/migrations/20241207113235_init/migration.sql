-- CreateEnum
CREATE TYPE "UserRoles" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'USER', 'MODERATOR');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "ItemCondition" AS ENUM ('NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'DAMAGED', 'NOT_WORKING');

-- CreateEnum
CREATE TYPE "ActivityLogAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- CreateEnum
CREATE TYPE "SubscriptionsStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PAUSED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "SubscriptionsCategories" AS ENUM ('REGULAR', 'SPONSORED');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "role" "UserRoles" NOT NULL DEFAULT 'USER',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "phone_number" TEXT,
    "profile_picture" TEXT,
    "profile_picture_public_id" TEXT,
    "personal_identity_picture" TEXT,
    "personal_identity_picture_public_id" TEXT,
    "birth_date" DATE NOT NULL,
    "address" TEXT,
    "city_id" INTEGER,
    "country_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name_ar" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "description_en" TEXT NOT NULL,
    "description_ar" TEXT NOT NULL,
    "image_url" TEXT,
    "image_public_id" TEXT,
    "parent_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "trade_value" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "condition" "ItemCondition" NOT NULL,
    "city_id" INTEGER NOT NULL,
    "country_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "is_banner" BOOLEAN NOT NULL DEFAULT false,
    "category_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_images" (
    "id" SERIAL NOT NULL,
    "image_url" TEXT NOT NULL,
    "image_public_id" TEXT,
    "item_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "item_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_logs" (
    "id" SERIAL NOT NULL,
    "action" "ActivityLogAction" NOT NULL DEFAULT 'CREATE',
    "user_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banners" (
    "id" SERIAL NOT NULL,
    "item_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" SERIAL NOT NULL,
    "title_ar" TEXT NOT NULL,
    "title_en" TEXT NOT NULL,
    "description_ar" TEXT NOT NULL,
    "description_en" TEXT NOT NULL,
    "image_url" TEXT,
    "image_public_id" TEXT,
    "price" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "offer_price" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "category" "SubscriptionsCategories" NOT NULL,
    "status" "SubscriptionsStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_options" (
    "id" SERIAL NOT NULL,
    "name_ar" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "subscriptions_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "subscription_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_subscriptions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "payment_details" JSONB NOT NULL,
    "subscriptions_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "user_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "countries" (
    "id" SERIAL NOT NULL,
    "name_ar" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cities" (
    "id" SERIAL NOT NULL,
    "name_ar" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "country_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_first_name_last_name_username_email_idx" ON "users"("first_name", "last_name", "username", "email");

-- CreateIndex
CREATE INDEX "items_title_idx" ON "items"("title");

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
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banners" ADD CONSTRAINT "banners_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_options" ADD CONSTRAINT "subscription_options_subscriptions_id_fkey" FOREIGN KEY ("subscriptions_id") REFERENCES "subscriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cities" ADD CONSTRAINT "cities_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
