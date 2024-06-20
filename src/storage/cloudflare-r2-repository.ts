import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { UploadProps, UploaderInterface } from "../interface/uploader-interface.js";
import { env } from "../env.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export class CloudflareR2Repository implements UploaderInterface {

    async uploadImage({imageName, buffer, mimetype}: UploadProps){
        
        const client = this.createBucket()

        const command =  new PutObjectCommand({
            Bucket: env.CLOUDFLARE_BUCKET_NAME,
            Key: imageName,
            Body: buffer,
            ContentType: mimetype
          })
        
        const createImage = await client.send(command);

        return createImage
    }
    async findImages(image: string) {
        const client = this.createBucket()

        const command = new GetObjectCommand({
            Bucket: env.CLOUDFLARE_BUCKET_NAME,
            Key: image
        })

        const url = await getSignedUrl(client, command, { expiresIn: 3600})

        return url
    }

    async deleteImages(image: string) {

        const client = this.createBucket()

        const command = new DeleteObjectCommand({
            Bucket: env.CLOUDFLARE_BUCKET_NAME,
            Key: image
        })
        
       return await client.send(command);
   }

    createBucket(): S3Client {

        const s3CLient = new S3Client({
            endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
            region: "auto",
            credentials: {
                accessKeyId: env.CLOUDFLARE_ACCESS_KEY,
                secretAccessKey: env.CLOUDFLARE_SECRET_KEY
            }
        });

        return s3CLient
    }

}