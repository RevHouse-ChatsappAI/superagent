/*
  Warnings:

  - A unique constraint covering the columns `[apiUserId]` on the table `PlatformKey` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `url` to the `PlatformKey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PlatformKey" ADD COLUMN     "url" TEXT NOT NULL,
ALTER COLUMN "key" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "PlatformKey_apiUserId_key" ON "PlatformKey"("apiUserId");
