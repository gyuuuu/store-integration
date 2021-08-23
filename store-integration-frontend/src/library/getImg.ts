// cSpell:ignore rakuten
import SVG from "@/library/importSVG";

export function getImg(storeName: string) {
  switch (storeName) {
    case "Rakuten":
      return SVG.rakuten;
    case "Shopify":
      return SVG.shopify;
    case "Amazon":
      return SVG.amazon;
    case "Qoo10":
      return SVG.qoo10;
    default:
      // error
      return;
  }
}
