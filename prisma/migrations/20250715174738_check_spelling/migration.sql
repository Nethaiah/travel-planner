/*
  Warnings:

  - You are about to drop the `activities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `itinerary_days` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "activities" DROP CONSTRAINT "activities_dayId_fkey";

-- DropForeignKey
ALTER TABLE "itinerary_days" DROP CONSTRAINT "itinerary_days_tripId_fkey";

-- DropTable
DROP TABLE "activities";

-- DropTable
DROP TABLE "itinerary_days";

-- CreateTable
CREATE TABLE "itinerary_day" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "day_number" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "title" TEXT,
    "notes" TEXT,

    CONSTRAINT "itinerary_day_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity" (
    "id" TEXT NOT NULL,
    "dayId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "location" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "start_time" TEXT,
    "end_time" TEXT,
    "cost" DOUBLE PRECISION,

    CONSTRAINT "activity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "itinerary_day" ADD CONSTRAINT "itinerary_day_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity" ADD CONSTRAINT "activity_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "itinerary_day"("id") ON DELETE CASCADE ON UPDATE CASCADE;
