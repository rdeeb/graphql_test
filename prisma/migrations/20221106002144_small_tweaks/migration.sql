/*
  Warnings:

  - You are about to alter the column `name` on the `TaskStatus` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(25)`.
  - You are about to alter the column `password` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(40)`.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "TaskStatus" ALTER COLUMN "name" SET DATA TYPE VARCHAR(25);

-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "slug" VARCHAR(25) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "username" VARCHAR(30) NOT NULL DEFAULT '',
ALTER COLUMN "password" SET DATA TYPE VARCHAR(40);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
