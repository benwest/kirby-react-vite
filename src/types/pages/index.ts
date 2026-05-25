import { z } from "zod"
import { DefaultPageContent } from "./default"
import { ErrorPageContent } from "./error"
import { HomePageContent } from "./home"
// plop:imports

export const PageContent = z.discriminatedUnion("type", [
  DefaultPageContent,
  HomePageContent,
  ErrorPageContent,
  // plop:union
])
export type PageContent = z.infer<typeof PageContent>
