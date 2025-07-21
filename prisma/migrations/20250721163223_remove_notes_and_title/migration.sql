/*
  Warnings:

  - You are about to drop the column `notes` on the `itinerary_day` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `itinerary_day` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "itinerary_day" DROP COLUMN "notes",
DROP COLUMN "title";
