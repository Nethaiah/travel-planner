/*
  Warnings:

  - You are about to drop the `activity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `itinerary_day` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "activity" DROP CONSTRAINT "activity_dayId_fkey";

-- DropForeignKey
ALTER TABLE "itinerary_day" DROP CONSTRAINT "itinerary_day_tripId_fkey";

-- DropTable
DROP TABLE "activity";

-- DropTable
DROP TABLE "itinerary_day";
