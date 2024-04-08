-- CreateTable
CREATE TABLE "PlatformKey" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL DEFAULT 'eh2iJ7QoiBRxZSRAp59f19c1',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "apiUserId" TEXT NOT NULL,

    CONSTRAINT "PlatformKey_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PlatformKey" ADD CONSTRAINT "PlatformKey_apiUserId_fkey" FOREIGN KEY ("apiUserId") REFERENCES "ApiUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
