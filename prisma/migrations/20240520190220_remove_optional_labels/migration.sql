/*
  Warnings:

  - Made the column `googleId` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `googleName` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "googleId" SET NOT NULL,
ALTER COLUMN "googleName" SET NOT NULL;
