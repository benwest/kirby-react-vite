import { z } from "zod"

export const HomePageContent = z.object({
  type: z.literal("home"),
  url: z.string(),
  title: z.string(),
})
export type HomePageContent = z.infer<typeof HomePageContent>
