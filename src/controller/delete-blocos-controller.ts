import type { Request, Response } from "express";
import { z } from "zod";
import { makeDeleteBloco } from "../factory/make-delete-bloco.js";
import { ResourceNotFoundError } from "../error/resource-not-found.js";

export const BlocoParamSchema = z.object({
    id: z.string().uuid()
})


export class DeleteBlocosController {

    async remove(req: Request, res: Response) {
        const { id } = BlocoParamSchema.parse(req.params)

        const deleteBlocosService = makeDeleteBloco()

        try {
            await deleteBlocosService.handle({
                id
            })

            return res.status(203).json({
                message: 'Delete successfully'
            })
        }catch(e) {
            if(e instanceof ResourceNotFoundError) {
                return res.status(404).json({
                    message: e.message
                }) 
            }

            return res.status(500).json({
                message: 'Server Internal Error'
            }) 
        }

    }

}