/*
  Warnings:

  - You are about to drop the column `agentId` on the `Count` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[apiUserId]` on the table `Count` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `apiUserId` to the `Count` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Count" DROP CONSTRAINT "Count_agentId_fkey";

-- DropIndex
DROP INDEX "Count_agentId_key";

-- AlterTable
ALTER TABLE "Count" DROP COLUMN "agentId",
ADD COLUMN     "apiUserId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Count_apiUserId_key" ON "Count"("apiUserId");

-- AddForeignKey
ALTER TABLE "Count" ADD CONSTRAINT "Count_apiUserId_fkey" FOREIGN KEY ("apiUserId") REFERENCES "ApiUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
