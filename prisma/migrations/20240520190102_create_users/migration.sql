-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "googleId" TEXT,
    "googleName" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "blocos_id" TEXT,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_blocos_id_fkey" FOREIGN KEY ("blocos_id") REFERENCES "blocos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
