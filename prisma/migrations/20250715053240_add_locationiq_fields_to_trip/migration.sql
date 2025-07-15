-- AlterTable
ALTER TABLE "trip" ADD COLUMN     "addressJson" JSONB,
ADD COLUMN     "class" TEXT,
ADD COLUMN     "displayName" TEXT,
ADD COLUMN     "icon" TEXT,
ADD COLUMN     "importance" DOUBLE PRECISION,
ADD COLUMN     "osmId" TEXT,
ADD COLUMN     "osmType" TEXT,
ADD COLUMN     "placeId" TEXT,
ADD COLUMN     "type" TEXT;
