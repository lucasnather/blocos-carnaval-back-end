import { Prisma } from "@prisma/client";
import { BlocosInterface, FotoType } from "../interface/blocos-interface.js";
import { prisma } from "../database/prisma.js";

export class BlocosRepository implements BlocosInterface {

    async create(bloco: Prisma.BlocosUncheckedCreateInput, foto: FotoType) {
        const { title, city, description, uf } = bloco
        const { image, url } = foto
        
        const blocos = await prisma.blocos.create({
            data: {
                title,
                description,
                city,
                uf,
                FotosBloco: {
                    create: {
                        image,
                        url
                    }
                }
            },
            include: {
                FotosBloco: {
                    select: {
                        id: true,
                        image: true,
                        url: true
                    }
                }
            }
        })

        return blocos

    }

    async remove(id: string) {
        const blocos = await prisma.blocos.delete({
            where: {
                id
            },
            include: {
                FotosBloco: {
                    select: {
                        id: true,
                        image: true,
                        url: true
                    }
                }
            }
        })

        return blocos
    }

    async findMany(page: number) {
       
        const blocos = await prisma.blocos.findMany({
            take: page + 9,
            include: {
                FotosBloco: {
                    select: {
                        id: true,
                        image: true,
                        url: true
                    }
                }
            }
        })

        return blocos

    }

}