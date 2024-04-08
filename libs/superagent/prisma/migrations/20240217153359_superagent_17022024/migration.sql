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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TierCredit_pkey" PRIMARY KEY ("tier")
);

-- CreateIndex
CREATE UNIQUE INDEX "Credit_apiUserId_subscriptionId_key" ON "Credit"("apiUserId", "subscriptionId");

-- AddForeignKey
ALTER TABLE "Credit" ADD CONSTRAINT "Credit_apiUserId_fkey" FOREIGN KEY ("apiUserId") REFERENCES "ApiUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credit" ADD CONSTRAINT "Credit_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
