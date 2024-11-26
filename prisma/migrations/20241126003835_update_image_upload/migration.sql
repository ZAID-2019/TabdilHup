-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "image_public_id" TEXT,
ALTER COLUMN "image_url" DROP NOT NULL;

-- AlterTable
ALTER TABLE "item_images" ADD COLUMN     "image_public_id" TEXT;

-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN     "image_public_id" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "personal_identity_picture_public_id" TEXT,
ADD COLUMN     "profile_picture_public_id" TEXT;
