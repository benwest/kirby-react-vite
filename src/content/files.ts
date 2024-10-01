import { z } from "zod"

export const ImageFileContent = z.object({
  type: z.literal("image"),
  srcSet: z.string(),
  ratio: z.number(),
})

export type ImageFileContent = z.infer<typeof ImageFileContent>
