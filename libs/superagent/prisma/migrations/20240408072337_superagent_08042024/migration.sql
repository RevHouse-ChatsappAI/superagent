-- CreateEnum
CREATE TYPE "AgentType" AS ENUM ('SUPERAGENT', 'OPENAI_ASSISTANT', 'LLM');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "LLMModel" ADD VALUE 'GPT_3_5_TURBO_0125';
ALTER TYPE "LLMModel" ADD VALUE 'GPT_4_TURBO_PREVIEW';
ALTER TYPE "LLMModel" ADD VALUE 'MIXTRAL_8X7B_INSTRUCT_V01';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "LLMProvider" ADD VALUE 'PERPLEXITY';
ALTER TYPE "LLMProvider" ADD VALUE 'TOGETHER_AI';
ALTER TYPE "LLMProvider" ADD VALUE 'ANTHROPIC';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ToolType" ADD VALUE 'SUPERRAG';
ALTER TYPE "ToolType" ADD VALUE 'RESEARCH';
ALTER TYPE "ToolType" ADD VALUE 'GITHUB';
ALTER TYPE "ToolType" ADD VALUE 'SCRAPER';
ALTER TYPE "ToolType" ADD VALUE 'GOOGLE_SEARCH';

-- AlterEnum
ALTER TYPE "VectorDbProvider" ADD VALUE 'SUPABASE';

-- DropForeignKey
ALTER TABLE "AgentDatasource" DROP CONSTRAINT "AgentDatasource_datasourceId_fkey";

-- DropForeignKey
ALTER TABLE "AgentTool" DROP CONSTRAINT "AgentTool_toolId_fkey";

-- DropForeignKey
ALTER TABLE "WorkflowStep" DROP CONSTRAINT "WorkflowStep_agentId_fkey";

-- DropForeignKey
ALTER TABLE "WorkflowStep" DROP CONSTRAINT "WorkflowStep_workflowId_fkey";

-- AlterTable
ALTER TABLE "Agent" ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "outputSchema" TEXT,
ADD COLUMN     "type" "AgentType" NOT NULL DEFAULT 'SUPERAGENT',
ALTER COLUMN "llmModel" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Tool" ALTER COLUMN "metadata" DROP NOT NULL;

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayApiKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "apiUserId" TEXT NOT NULL,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowConfig" (
    "id" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "workflowId" TEXT NOT NULL,
    "apiUserId" TEXT,

    CONSTRAINT "WorkflowConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "api_user_id" ON "ApiKey"("apiUserId");

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_apiUserId_fkey" FOREIGN KEY ("apiUserId") REFERENCES "ApiUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentDatasource" ADD CONSTRAINT "AgentDatasource_datasourceId_fkey" FOREIGN KEY ("datasourceId") REFERENCES "Datasource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentTool" ADD CONSTRAINT "AgentTool_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowConfig" ADD CONSTRAINT "WorkflowConfig_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowConfig" ADD CONSTRAINT "WorkflowConfig_apiUserId_fkey" FOREIGN KEY ("apiUserId") REFERENCES "ApiUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowStep" ADD CONSTRAINT "WorkflowStep_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowStep" ADD CONSTRAINT "WorkflowStep_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
