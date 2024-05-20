import { z } from "zod"

export const BlocosBodySchema = z.object({
    title: z.string(),
    description: z.string(),
    city: z.string(),
    uf: z.string(),
})

export const BlocosFileSchema = z.object({
    mimetype: z.string()
})

export const BlocosQuerySchema = z.object({
    page: z.coerce.number().optional().default(0)
})

export const BlocoParamSchema = z.object({
    id: z.string().uuid()
})
