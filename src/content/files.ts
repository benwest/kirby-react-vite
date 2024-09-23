import { z } from "zod"

export const ImageFileContent = z.object({
  type: z.literal("image"),
  srcset: z.string(),
  ratio: z.number(),
})

export type ImageFileContent = z.infer<typeof ImageFileContent>
