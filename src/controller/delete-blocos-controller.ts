import type { Request, Response } from "express";
import { z } from "zod";
import { makeDeleteBloco } from "../factory/make-delete-bloco.js";

export const BlocoParamSchema = z.object({
    id: z.string().uuid()
})


export class DeleteBlocosController {

    async remove(req: Request, res: Response) {
        const { id } = BlocoParamSchema.parse(req.params)

        const deleteBlocosService = makeDeleteBloco()

        await deleteBlocosService.handle({
            id
        })

        return res.status(203).json({
            message: 'Delete successfully'
        })
    }

}