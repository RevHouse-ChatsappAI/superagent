/*
  Warnings:

  - You are about to drop the column `metadata` on the `Agent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Agent" DROP COLUMN "metadata";

-- CreateTable
CREATE TABLE "PlatformKey" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "apiUserId" TEXT NOT NULL,

    CONSTRAINT "PlatformKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlatformKey_apiUserId_key" ON "PlatformKey"("apiUserId");

-- AddForeignKey
ALTER TABLE "PlatformKey" ADD CONSTRAINT "PlatformKey_apiUserId_fkey" FOREIGN KEY ("apiUserId") REFERENCES "ApiUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
