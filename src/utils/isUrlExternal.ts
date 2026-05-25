export function isUrlExternal(url: string): boolean {
  if (!url.startsWith("http")) return false
  return new URL(url).hostname !== window.location.hostname
}
