import { z } from "zod"

export const ErrorPageContent = z.object({
  type: z.literal("error"),
  title: z.string(),
  url: z.string(),
})
export type ErrorPageContent = z.infer<typeof ErrorPageContent>

export const DefaultPageContent = z.object({
  type: z.literal("default"),
  title: z.string(),
  url: z.string(),
  content: z.record(z.any()),
})
export type DefaultPageContent = z.infer<typeof DefaultPageContent>

export const HomePageContent = z.object({
  type: z.literal("home"),
  title: z.string(),
})
export type HomePageContent = z.infer<typeof HomePageContent>

export const PageContent = z.discriminatedUnion("type", [
  DefaultPageContent,
  HomePageContent,
  ErrorPageContent,
])
export type PageContent = z.infer<typeof PageContent>
