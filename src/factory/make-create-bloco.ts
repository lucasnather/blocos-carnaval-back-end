import { BlocosRepository } from "../repository/blocos-repository.js"
import { CreateBlocosService } from "../service/create-blocos-service.js"
import { AwsS3Repository } from "../storage/aws-s3-repository.js"

export function makeCreateBloco() {
    const awsRepository = new AwsS3Repository()
    const blocosRepository = new BlocosRepository()
    const createBlocosService = new CreateBlocosService(awsRepository, blocosRepository)

    return createBlocosService
}