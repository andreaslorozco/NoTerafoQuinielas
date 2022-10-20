/*
  Warnings:

  - Added the required column `invite_code` to the `Lobby` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lobby" ADD COLUMN     "invite_code" TEXT NOT NULL;
