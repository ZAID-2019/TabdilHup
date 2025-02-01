-- CreateTable
CREATE TABLE "TempCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parentCategoryId" TEXT,
    "isParent" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TempCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TempItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subCategoryId" TEXT NOT NULL,

    CONSTRAINT "TempItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TempCategory_parentCategoryId_idx" ON "TempCategory"("parentCategoryId");

-- AddForeignKey
ALTER TABLE "TempCategory" ADD CONSTRAINT "TempCategory_parentCategoryId_fkey" FOREIGN KEY ("parentCategoryId") REFERENCES "TempCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TempItem" ADD CONSTRAINT "TempItem_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "TempCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
