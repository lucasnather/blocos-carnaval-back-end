import type { Request, Response } from 'express'
import { z } from "zod";
import { makeCreateBloco } from '../factory/make-create-bloco.js';

const BlocosBodySchema = z.object({
    title: z.string(),
    description: z.string(),
    city: z.string(),
    uf: z.string(),
})

const BlocosFileSchema = z.object({
    mimetype: z.string()
})

export class CreateBlocosController {

    async post(req: Request, res: Response) {
        const { title, description, city, uf } = BlocosBodySchema.parse(req.body)
        const { mimetype } =  BlocosFileSchema.parse(req.file)

        const buffer = req.file?.buffer

        const createBlocosService = makeCreateBloco()
        
        const blocos = await createBlocosService.handle({
            city,description,mimetype,buffer,title, uf
        })

        return res.status(201).json(blocos)

    }

}