import { BlocosRepository } from "../repository/blocos-repository.js"
import { FindManyBlocosService } from "../service/find-many-blocos-service.js"

export function makeFindManyBloco() {
    const blocosRepository = new BlocosRepository()
    const findManyBlocosService = new FindManyBlocosService(blocosRepository)

    return findManyBlocosService
}