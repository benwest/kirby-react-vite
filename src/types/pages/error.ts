import { z } from "zod"

export const ErrorPageContent = z.object({
  type: z.literal("error"),
  title: z.string(),
  url: z.string(),
})
export type ErrorPageContent = z.infer<typeof ErrorPageContent>
