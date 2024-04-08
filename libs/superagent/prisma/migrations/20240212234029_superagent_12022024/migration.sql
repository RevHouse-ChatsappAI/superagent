/*
  Warnings:

  - You are about to drop the column `paidAt` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `validUntil` on the `Subscription` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[apiUserId]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Subscription_apiUserId_paidAt_key";

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "paidAt",
DROP COLUMN "validUntil";

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_apiUserId_key" ON "Subscription"("apiUserId");
