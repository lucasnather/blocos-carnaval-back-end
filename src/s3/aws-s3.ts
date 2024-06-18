import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { env } from "../env.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export class AwsS3 {

    async insertImagesInAws(imageName: string, buffer: Buffer, mimetype: string) {
        const client = this.createBucket()

        const command =  new PutObjectCommand({
            Bucket: env.BUCKET_NAME,
            Key: imageName,
            Body: buffer,
            ContentType: mimetype
          })
        
        const createImage = await client.send(command);

        return createImage
       
    }

   async getImagesInAws(imageName: string) {
        const client = this.createBucket()

        const command = new GetObjectCommand({
            Bucket: env.BUCKET_NAME,
            Key: imageName
        })

        const url = await getSignedUrl(client, command, { expiresIn: 3600})

        return url
    }
    
    async deleteImagesInAws(imageName: string) {
        const client = this.createBucket()

        const command = new DeleteObjectCommand({
            Bucket: env.BUCKET_NAME,
            Key: imageName
        })
        
        await client.send(command);
   }

   private createBucket() {
        const s3CLient = new S3Client({
            region: env.REGION_BUCKET,
            credentials: {
                accessKeyId: env.AWS_ACCESS_KEY_ID,
                secretAccessKey: env.AWS_SECRET_KEY_ID
            }
        });

        return s3CLient
    }

}
