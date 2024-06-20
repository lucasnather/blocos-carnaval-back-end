import { UploaderInterface } from "../interface/uploader-interface.js";
import {  BlocosInterface, CreateAndDeleteBlocosResponse } from "../interface/blocos-interface.js";
import { randomUUID } from "node:crypto";
import sharp from "sharp";

interface CreateBlocosRequest {
    title: string,
    description: string,
    city: string,
    uf: string,
    mimetype: string
    buffer: Buffer | undefined
}

interface CreateBlocosResponse {
    blocos: CreateAndDeleteBlocosResponse
}


export class CreateBlocosService {

    constructor(
        private uploaderInterface: UploaderInterface,
        private blocosInterface: BlocosInterface
    ) {}

    async handle({ city,description, title, uf, mimetype, buffer }: CreateBlocosRequest): Promise<CreateBlocosResponse> {

        const imageName = this.generateImageName()
        const bufferImage = buffer ? buffer : undefined
        const resizeImage = await this.resizeImage(bufferImage)
        const url = await this.uploaderInterface.findImages(imageName)

        const [blocos, storage] = await Promise.all([
            await this.blocosInterface.create({
                city, 
                description, 
                title, 
                uf
            }, { image: imageName, url }),
            
            await this.uploaderInterface.uploadImage({
                imageName,
                buffer: resizeImage , 
                mimetype
            })
        ])

        return {
            blocos
        }

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