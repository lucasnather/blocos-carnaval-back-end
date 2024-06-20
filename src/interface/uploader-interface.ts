import { DeleteObjectCommandOutput, PutObjectAclCommandOutput, S3Client } from "@aws-sdk/client-s3"

export type UploadProps = {
    imageName: string
    buffer: Buffer
    mimetype: string
}

export interface UploaderInterface {
    uploadImage(upload: UploadProps): Promise<PutObjectAclCommandOutput>
    findImages(image: string): Promise<string>
    deleteImages(image: string): Promise<DeleteObjectCommandOutput>
    createBucket(): S3Client
}