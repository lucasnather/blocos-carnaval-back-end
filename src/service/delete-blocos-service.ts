import { UploaderInterface } from "../interface/uploader-interface.js";
import {  BlocosInterface, CreateAndDeleteBlocosResponse } from "../interface/blocos-interface.js";
import { ResourceNotFoundError } from "../error/resource-not-found.js";

interface DeleteBlocosRequest {
    id: string
}

interface DeleteBlocosResponse {
    blocos: CreateAndDeleteBlocosResponse
}


export class DeleteBlocosService {

    constructor(
        private uploaderInterface: UploaderInterface,
        private blocosInterface: BlocosInterface
    ) {}

    async handle({ id }: DeleteBlocosRequest): Promise<DeleteBlocosResponse> {
        const findBlocos = await this.blocosInterface.findById(id)

        if(!findBlocos) throw new ResourceNotFoundError()

        const blocos = await this.blocosInterface.remove(id)

        const image = blocos.FotosBloco[0].image

        await this.uploaderInterface.deleteImages(image)

        return {
            blocos
        }

    }
}