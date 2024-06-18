import { z } from "zod"
import { prisma } from "../database/prisma.js"
import type { Request, Response } from 'express'

const BlocosQuerySchema = z.object({
    page: z.coerce.number().optional().default(0)
})

export class FindManyBlocosController {

    async get(req: Request, res: Response) {
        const { page } = BlocosQuerySchema.parse(req.query)
    
        const blocos = await prisma.blocos.findMany({
            take: page + 9,
            include: {
                FotosBloco: {
                    select: {
                        image: true,
                        url: true
                    }
                }
            }
        })

        return res.status(200).json(blocos)
    }
}