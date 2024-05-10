/*
  Warnings:

  - Added the required column `subscriptionId` to the `PlatformKey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PlatformKey" ADD COLUMN     "subscriptionId" TEXT NOT NULL;
