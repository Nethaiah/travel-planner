/*
  Warnings:

  - You are about to drop the column `end_time` on the `activity` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `activity` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `activity` table. All the data in the column will be lost.
  - You are about to drop the column `start_time` on the `activity` table. All the data in the column will be lost.
  - Changed the type of `category` on the `activity` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ActivityCategory" AS ENUM ('activity', 'accommodation', 'food', 'transport', 'other');

-- AlterTable
ALTER TABLE "activity" DROP COLUMN "end_time",
DROP COLUMN "latitude",
DROP COLUMN "longitude",
DROP COLUMN "start_time",
ADD COLUMN     "endTime" TEXT,
ADD COLUMN     "startTime" TEXT,
DROP COLUMN "category",
ADD COLUMN     "category" "ActivityCategory" NOT NULL;
