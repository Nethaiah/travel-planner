/*
  Warnings:

  - Made the column `title` on table `itinerary_day` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "itinerary_day" ALTER COLUMN "title" SET NOT NULL;
