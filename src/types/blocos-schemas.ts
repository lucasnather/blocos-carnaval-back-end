import { z } from "zod"



export const BlocoParamSchema = z.object({
    id: z.string().uuid()
})
