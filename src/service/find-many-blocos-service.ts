import {  BlocosInterface, FindBlocosResponse } from "../interface/blocos-interface.js";

interface FindManyBlocosRequest {
    page: number
}

interface FindManyBlocosResponse {
    blocos: FindBlocosResponse[]
}

export class FindManyBlocosService {

    constructor(
        private blocosInterface: BlocosInterface
    ) {}

    async handle({ page }: FindManyBlocosRequest): Promise<FindManyBlocosResponse> {

        const blocos = await this.blocosInterface.findMany(page)

        return {
            blocos
        }

    }
}