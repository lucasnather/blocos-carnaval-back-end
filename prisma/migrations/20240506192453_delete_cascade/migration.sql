-- DropForeignKey
ALTER TABLE "fotos_bloco" DROP CONSTRAINT "fotos_bloco_blocos_id_fkey";

-- AddForeignKey
ALTER TABLE "fotos_bloco" ADD CONSTRAINT "fotos_bloco_blocos_id_fkey" FOREIGN KEY ("blocos_id") REFERENCES "blocos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
