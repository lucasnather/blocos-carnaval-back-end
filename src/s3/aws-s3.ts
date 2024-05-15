import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { env } from "../env.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export class AwsS3 {

    createBucket() {
        const s3CLient = new S3Client({
            region: env.REGION_BUCKET,
            credentials: {
                accessKeyId: env.ACCESS_KEY_ID,
                secretAccessKey: env.SECRET_KEY_ID
            }
        });

        return s3CLient
    }

    async insertImagesInAws(imageName: string, buffer: Buffer, mimetype: string) {
        const client = this.createBucket()
        
        const createImage = await client.send(
            new PutObjectCommand({
              Bucket: env.BUCKET_NAME,
              Key: imageName,
              Body: buffer,
              ContentType: mimetype
                
            })
        );

        return createImage
       
    }

   async getImagesInAws(imageName: string) {
        const client = this.createBucket()
        
        const getObjectParams = {
            Bucket: env.BUCKET_NAME,
            Key: imageName
        }

        const command = new GetObjectCommand(getObjectParams)
        const url = await getSignedUrl(client, command, { expiresIn: 3600})

        return url
    }
    
    async deleteImagesInAws(imageName: string) {
        const client = this.createBucket()
        
        await client.send(
            new DeleteObjectCommand({
                Bucket: env.BUCKET_NAME,
                Key: imageName
            })
        );
   }
}
