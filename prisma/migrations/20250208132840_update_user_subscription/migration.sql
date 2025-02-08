-- AlterTable
ALTER TABLE "user_subscriptions" ALTER COLUMN "subscriptions_id" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_subscriptions_id_fkey" FOREIGN KEY ("subscriptions_id") REFERENCES "subscriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
