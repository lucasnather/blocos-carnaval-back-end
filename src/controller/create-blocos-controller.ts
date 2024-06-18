import { Request, Response } from 'express'
import { z } from "zod";
import { AwsS3 } from '../s3/aws-s3.js';
import { randomUUID } from 'node:crypto';
import sharp from 'sharp';
import { prisma } from '../database/prisma.js';

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
        const { mimetype: type } =  BlocosFileSchema.parse(req.file)

        const awsS3 = new AwsS3()
        const imageName = this.generateImageName()
        const url = await awsS3.getImagesInAws(imageName)

        const bufferImage = req.file ? req.file.buffer : undefined
        const resizeImage = await this.resizeImage(bufferImage)

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

        await awsS3.insertImagesInAws(imageName, resizeImage, type)

        return res.status(201).json(blocos)

    }

    private generateImageName() {
        const imageName = randomUUID()

        return imageName
    }

    private async resizeImage(buffer: Buffer | undefined) {
        return await sharp(buffer).resize({
            height: 180,
            width: 400,
            fit: 'contain'
        }).toBuffer()
    }
}