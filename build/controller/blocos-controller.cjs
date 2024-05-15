"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/controller/blocos-controller.ts
var blocos_controller_exports = {};
__export(blocos_controller_exports, {
  blocosController: () => blocosController
});
module.exports = __toCommonJS(blocos_controller_exports);
var import_zod2 = require("zod");

// src/database/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/s3/aws-s3.ts
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

// src/controller/blocos-controller.ts
var import_node_crypto = require("crypto");
var import_sharp = __toESM(require("sharp"), 1);
var BlocosBodySchema = import_zod2.z.object({
  title: import_zod2.z.string(),
  description: import_zod2.z.string(),
  city: import_zod2.z.string(),
  uf: import_zod2.z.string()
});
var BlocosFileSchema = import_zod2.z.object({
  mimetype: import_zod2.z.string()
});
var BlocosQuerySchema = import_zod2.z.object({
  page: import_zod2.z.coerce.number().optional().default(0)
});
var BlocoParamSchema = import_zod2.z.object({
  id: import_zod2.z.string().uuid()
});
var BlocosController = class {
  async post(req, res) {
    const { title, description, city, uf } = BlocosBodySchema.parse(req.body);
    const { mimetype } = BlocosFileSchema.parse(req.file);
    const awsS3 = new AwsS3();
    const imageName = this.generateImageName();
    const buffer = await (0, import_sharp.default)(req.file?.buffer).resize({
      height: 180,
      width: 400,
      fit: "contain"
    }).toBuffer();
    const blocos = await prisma.blocos.create({
      data: {
        title,
        description,
        city,
        uf,
        FotosBloco: {
          create: {
            image: imageName
          }
        }
      },
      include: {
        FotosBloco: {
          select: {
            id: true,
            image: true
          }
        }
      }
    });
    await awsS3.insertImagesInAws(imageName, buffer, mimetype);
    return res.status(201).json(blocos);
  }
  async get(req, res) {
    const { page } = BlocosQuerySchema.parse(req.query);
    const awsS3 = new AwsS3();
    const blocos = await prisma.blocos.findMany({
      take: page + 9
    });
    const fotos = await prisma.fotosBloco.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });
    const url = await awsS3.getImagesInAws(fotos);
    return res.status(200).json({
      blocos,
      fotos: url
    });
  }
  async remove(req, res) {
    const { id } = BlocoParamSchema.parse(req.params);
    const awsS3 = new AwsS3();
    const blocos = await prisma.blocos.delete({
      where: {
        id
      },
      include: {
        FotosBloco: {
          select: {
            id: true,
            image: true
          }
        }
      }
    });
    const imageName = blocos.FotosBloco[0].image;
    await awsS3.deleteImagesInAws(imageName);
    return res.status(203).json({
      message: "Delete successfully"
    });
  }
  generateImageName() {
    const imageName = (0, import_node_crypto.randomUUID)();
    return imageName;
  }
};
var blocosController = new BlocosController();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  blocosController
});
