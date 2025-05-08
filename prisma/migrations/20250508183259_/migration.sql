-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_modeId_fkey";

-- DropForeignKey
ALTER TABLE "Switch" DROP CONSTRAINT "Switch_modeId_fkey";

-- AddForeignKey
ALTER TABLE "Switch" ADD CONSTRAINT "Switch_modeId_fkey" FOREIGN KEY ("modeId") REFERENCES "Mode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_modeId_fkey" FOREIGN KEY ("modeId") REFERENCES "Mode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
