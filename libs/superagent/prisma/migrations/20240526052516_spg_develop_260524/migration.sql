/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `ApiUser` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ApiUser" ADD COLUMN     "subscriptionId" TEXT,
ADD COLUMN     "tier" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ApiUser_id_key" ON "ApiUser"("id");

-- AddForeignKey
ALTER TABLE "ApiUser" ADD CONSTRAINT "ApiUser_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;
