import { BlocosRepository } from "../repository/blocos-repository.js"
import { DeleteBlocosService } from "../service/delete-blocos-service.js"
import { AwsS3Repository } from "../storage/aws-s3-repository.js"

export function makeDeleteBloco() {
    const awsRepository = new AwsS3Repository()
    const blocosRepository = new BlocosRepository()
    const deleteBlocosService = new DeleteBlocosService(awsRepository, blocosRepository)

    return deleteBlocosService
}