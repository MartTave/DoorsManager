-- DropForeignKey
ALTER TABLE "User_Door" DROP CONSTRAINT "User_Door_did_fkey";

-- DropForeignKey
ALTER TABLE "User_Door" DROP CONSTRAINT "User_Door_uid_fkey";

-- AddForeignKey
ALTER TABLE "User_Door" ADD CONSTRAINT "User_Door_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Door" ADD CONSTRAINT "User_Door_did_fkey" FOREIGN KEY ("did") REFERENCES "Door"("id") ON DELETE CASCADE ON UPDATE CASCADE;
