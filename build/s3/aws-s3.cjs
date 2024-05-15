"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/s3/aws-s3.ts
var aws_s3_exports = {};
__export(aws_s3_exports, {
  AwsS3: () => AwsS3
});
module.exports = __toCommonJS(aws_s3_exports);
var import_client_s3 = require("@aws-sdk/client-s3");

// src/env.ts
var import_zod = require("zod");
var EnvSchema = import_zod.z.object({
  PORT: import_zod.z.coerce.number().default(8080),
  DATABASE_URL: import_zod.z.string().url(),
  BUCKET_NAME: import_zod.z.string(),
  ACCESS_KEY_ID: import_zod.z.string(),
  SECRET_KEY_ID: import_zod.z.string(),
  REGION_BUCKET: import_zod.z.string()
});
var _env = EnvSchema.safeParse(process.env);
if (!_env.success) {
  console.error("Environment Variable Error", _env.error);
  throw new Error("Environment Variable Error");
}
var env = _env.data;

// src/s3/aws-s3.ts
var import_s3_request_presigner = require("@aws-sdk/s3-request-presigner");
var AwsS3 = class {
  createBucket() {
    const s3CLient = new import_client_s3.S3Client({
      region: env.REGION_BUCKET,
      credentials: {
        accessKeyId: env.ACCESS_KEY_ID,
        secretAccessKey: env.SECRET_KEY_ID
      }
    });
    return s3CLient;
  }
  async insertImagesInAws(imageName, buffer, mimetype) {
    const client = this.createBucket();
    const createImage = await client.send(
      new import_client_s3.PutObjectCommand({
        Bucket: env.BUCKET_NAME,
        Key: imageName,
        Body: buffer,
        ContentType: mimetype
      })
    );
    return createImage;
  }
  async getImagesInAws(fotos) {
    const client = this.createBucket();
    let url = "";
    for (const foto of fotos) {
      const getObjectParams = {
        Bucket: env.BUCKET_NAME,
        Key: foto.image
      };
      const command = new import_client_s3.GetObjectCommand(getObjectParams);
      url = await (0, import_s3_request_presigner.getSignedUrl)(client, command, { expiresIn: 3600 });
    }
    return url;
  }
  async deleteImagesInAws(imageName) {
    const client = this.createBucket();
    await client.send(
      new import_client_s3.DeleteObjectCommand({
        Bucket: env.BUCKET_NAME,
        Key: imageName
      })
    );
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AwsS3
});
