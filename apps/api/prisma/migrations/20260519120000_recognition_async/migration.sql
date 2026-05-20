-- AlterEnum
ALTER TYPE "RecognitionStatus" ADD VALUE IF NOT EXISTS 'processing';
ALTER TYPE "RecognitionStatus" ADD VALUE IF NOT EXISTS 'failed';

-- AlterTable
ALTER TABLE "recognition_tasks" ADD COLUMN IF NOT EXISTS "provider" TEXT;
ALTER TABLE "recognition_tasks" ADD COLUMN IF NOT EXISTS "error_message" TEXT;
