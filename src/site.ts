import { SiteContent } from "./content/site"

const json = document.getElementById("siteData")!.textContent!
export const site = SiteContent.parse(JSON.parse(json!))
