import { z } from "zod"

export const DefaultPageContent = z.object({
  type: z.literal("default"),
  url: z.string(),
  title: z.string(),
})
export type DefaultPageContent = z.infer<typeof DefaultPageContent>
