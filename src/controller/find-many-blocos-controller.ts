import type { Request, Response } from 'express'
import { makeFindManyBloco } from "../factory/make-find-many-blocos.js"
import { z } from "zod"

const BlocosQuerySchema = z.object({
    page: z.coerce.number().optional().default(0)
})

export class FindManyBlocosController {

    async get(req: Request, res: Response) {
        const { page } = BlocosQuerySchema.parse(req.query)
    
        const findManyBlocosService = makeFindManyBloco()

        const blocos = await findManyBlocosService.handle({
            page
        })

        return res.status(200).json(blocos)
    }
}