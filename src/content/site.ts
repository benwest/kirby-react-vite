import { z } from "zod"

export const SiteContent = z.object({
  title: z.string(),
  url: z.string(),
})
export type SiteContent = z.infer<typeof SiteContent>
