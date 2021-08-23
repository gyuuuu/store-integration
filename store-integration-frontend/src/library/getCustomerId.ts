import { parseDomain, fromUrl } from "parse-domain";

export function getCustomerId() {
  const domain = parseDomain(fromUrl(window.location.href));
  if (domain.type === "RESERVED" && domain.hostname === "localhost") {
    return "gyu";
  }
  return (domain as any).subDomains.shift();
}
