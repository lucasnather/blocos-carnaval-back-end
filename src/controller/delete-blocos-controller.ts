import { Request, Response } from "express";
import { AwsS3 } from "../s3/aws-s3.js";
import { prisma } from "../database/prisma.js";
import { z } from "zod";

export const BlocoParamSchema = z.object({
    id: z.string().uuid()
})


export class DeleteBlocosController {

    async remove(req: Request, res: Response) {
        const { id } = BlocoParamSchema.parse(req.params)

        const awsS3 = new AwsS3()

        const blocos = await prisma.blocos.delete({
            where: {
                id
            },
            include: {
                FotosBloco: {
                    select: {
                        id: true,
                        image: true
                    }
                }
            }
        })

        const imageName = blocos.FotosBloco[0].image

       await awsS3.deleteImagesInAws(imageName)

        return res.status(203).json({
            message: 'Delete successfully'
        })
    }

}