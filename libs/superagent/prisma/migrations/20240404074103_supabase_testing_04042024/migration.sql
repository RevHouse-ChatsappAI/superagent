-- CreateTable
CREATE TABLE "Count" (
    "id" TEXT NOT NULL,
    "apiUserId" TEXT NOT NULL,
    "queryCount" INTEGER NOT NULL DEFAULT 0,
    "agentCount" INTEGER NOT NULL DEFAULT 0,
    "datasourceCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Count_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "agentToken" TEXT NOT NULL,
    "userToken" TEXT NOT NULL,
    "apiUserChatwoot" TEXT NOT NULL,
    "apiUserId" TEXT NOT NULL,
    "isAgentActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "apiUserId" TEXT NOT NULL,
    "stripeCustomerId" TEXT NOT NULL,
    "tier" TEXT NOT NULL DEFAULT 'BASE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Credit" (
    "id" TEXT NOT NULL,
    "apiUserId" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "credits" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Credit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TierCredit" (
    "tier" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "agentLimit" INTEGER NOT NULL DEFAULT 1,
    "datasourceLimit" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TierCredit_pkey" PRIMARY KEY ("tier")
);

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
CREATE UNIQUE INDEX "Count_apiUserId_key" ON "Count"("apiUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Token_agentToken_key" ON "Token"("agentToken");

-- CreateIndex
CREATE UNIQUE INDEX "Token_apiUserChatwoot_key" ON "Token"("apiUserChatwoot");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeCustomerId_key" ON "Subscription"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_apiUserId_key" ON "Subscription"("apiUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Credit_apiUserId_subscriptionId_key" ON "Credit"("apiUserId", "subscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "PlatformKey_apiUserId_key" ON "PlatformKey"("apiUserId");

-- AddForeignKey
ALTER TABLE "Count" ADD CONSTRAINT "Count_apiUserId_fkey" FOREIGN KEY ("apiUserId") REFERENCES "ApiUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_apiUserId_fkey" FOREIGN KEY ("apiUserId") REFERENCES "ApiUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_apiUserId_fkey" FOREIGN KEY ("apiUserId") REFERENCES "ApiUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credit" ADD CONSTRAINT "Credit_apiUserId_fkey" FOREIGN KEY ("apiUserId") REFERENCES "ApiUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credit" ADD CONSTRAINT "Credit_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlatformKey" ADD CONSTRAINT "PlatformKey_apiUserId_fkey" FOREIGN KEY ("apiUserId") REFERENCES "ApiUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
