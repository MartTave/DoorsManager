-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isadmin" BOOLEAN NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Door" (
    "id" SERIAL NOT NULL,
    "closed" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Door_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User_Door" (
    "uid" INTEGER NOT NULL,
    "did" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Log" (
    "id" SERIAL NOT NULL,
    "uid" INTEGER NOT NULL,
    "did" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "actionid" INTEGER NOT NULL,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Action" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_Door_uid_did_key" ON "User_Door"("uid", "did");

-- AddForeignKey
ALTER TABLE "User_Door" ADD CONSTRAINT "User_Door_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Door" ADD CONSTRAINT "User_Door_did_fkey" FOREIGN KEY ("did") REFERENCES "Door"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_did_fkey" FOREIGN KEY ("did") REFERENCES "Door"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
