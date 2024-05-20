import { Request, Response } from "express";
import { prisma } from "../database/prisma.js";
import { AwsS3 } from "../s3/aws-s3.js";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { BlocoParamSchema, BlocosBodySchema, BlocosFileSchema, BlocosQuerySchema } from "../types/blocos-schemas.js";

export class BlocosController {

    async post(req: Request, res: Response) {
        const { title, description, city, uf } = BlocosBodySchema.parse(req.body)
        const { mimetype: type } =  BlocosFileSchema.parse(req.file)

        const awsS3 = new AwsS3()
        const imageName = this.generateImageName()
        const url = await awsS3.getImagesInAws(imageName)
      
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
                        image: imageName,
                        url
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

        await awsS3.insertImagesInAws(imageName, buffer, type)

        return res.status(201).json(blocos)
    }

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
