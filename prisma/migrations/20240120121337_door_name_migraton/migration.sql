/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Door` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Door` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Door" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Door_name_key" ON "Door"("name");
