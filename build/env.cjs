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

// src/env.ts
var env_exports = {};
__export(env_exports, {
  env: () => env
});
module.exports = __toCommonJS(env_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  env
});
