-- AlterTable
ALTER TABLE "Mode" ADD COLUMN     "description" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Schedule" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Switch" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
