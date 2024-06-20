import { z } from "zod";

const EnvSchema = z.object({
    PORT: z.coerce.number().default(8080),
    DATABASE_URL: z.string().url(),
    BUCKET_NAME: z.string(),
    AWS_ACCESS_KEY_ID: z.string(),
    AWS_SECRET_KEY_ID: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET_ID: z.string(),
    GOOGLE_CALLBACK_URL: z.string().url(),
    SECRET_PASSWORD_SESSION: z.string(),
    REGION_BUCKET: z.string(),
    CLOUDFLARE_BUCKET_NAME: z.string(),
    CLOUDFLARE_ACCOUNT_ID: z.string(),
    CLOUDFLARE_ACCESS_KEY: z.string(),
    CLOUDFLARE_SECRET_KEY: z.string(),
})

const _env = EnvSchema.safeParse(process.env)

if(!_env.success) {
    console.error('Environment Variable Error', _env.error)

    throw new Error('Environment Variable Error')
}

export const env = _env.data