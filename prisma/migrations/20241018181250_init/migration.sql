-- DropIndex
DROP INDEX "users_username_email_idx";

-- CreateIndex
CREATE INDEX "users_first_name_last_name_username_email_idx" ON "users"("first_name", "last_name", "username", "email");
