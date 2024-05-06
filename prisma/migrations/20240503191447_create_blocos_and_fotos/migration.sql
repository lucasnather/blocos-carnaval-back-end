-- CreateTable
CREATE TABLE "blocos" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "blocos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fotos_bloco" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "blocos_id" TEXT NOT NULL,

    CONSTRAINT "fotos_bloco_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "fotos_bloco" ADD CONSTRAINT "fotos_bloco_blocos_id_fkey" FOREIGN KEY ("blocos_id") REFERENCES "blocos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
