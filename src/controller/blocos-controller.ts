import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../database/prisma.js";
import { AwsS3 } from "../s3/aws-s3.js";
import { randomUUID } from "node:crypto";
import sharp from "sharp";

const BlocosBodySchema = z.object({
    title: z.string(),
    description: z.string(),
    city: z.string(),
    uf: z.string(),
})

const BlocosFileSchema = z.object({
    mimetype: z.string()
})

const BlocosQuerySchema = z.object({
    page: z.coerce.number().optional().default(0)
})

const BlocoParamSchema = z.object({
    id: z.string().uuid()
})

class BlocosController {

    async post(req: Request, res: Response) {
        const { title, description, city, uf } = BlocosBodySchema.parse(req.body)
        const { mimetype } =  BlocosFileSchema.parse(req.file)

        const awsS3 = new AwsS3()
        const imageName = this.generateImageName()
      
        const buffer = await sharp(req.file?.buffer).resize({
            height: 180,
            width: 400,
            fit: 'contain'
        }).toBuffer()

        
        const blocos = await prisma.blocos.create({
            data: {
                title,
                description,
                city,
                uf,
                FotosBloco: {
                    create: {
                        image: imageName
                    }
                }
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

        await awsS3.insertImagesInAws(imageName, buffer, mimetype)

        return res.status(201).json(blocos)
    }

    async get(req: Request, res: Response) {
        const { page } = BlocosQuerySchema.parse(req.query)
        const awsS3 = new AwsS3()
    
        const blocos = await prisma.blocos.findMany({
            take: page + 9
        })

        const fotos = await prisma.fotosBloco.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        })

       const url = await awsS3.getImagesInAws(fotos)
        
        return res.status(200).json({
            blocos,
            fotos: url
        })
    }

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

    private generateImageName() {
        const imageName = randomUUID()

        return imageName
    }
}

export const blocosController = new BlocosController()