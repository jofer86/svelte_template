-- CreateTable
CREATE TABLE "Caca" (
    "id" TEXT NOT NULL,
    "smell" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "consistency" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Caca_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Caca_createdAt_idx" ON "Caca"("createdAt");
