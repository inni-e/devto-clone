/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "imageUrl",
ADD COLUMN     "imageKey" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "imageKey" TEXT;
