-- AlterTable
ALTER TABLE "TierCredit" ADD COLUMN     "agentLimit" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "datasourceLimit" INTEGER NOT NULL DEFAULT 1;
