import SVG from "@/library/importSVG";

interface getStoreType {
  img: any;
  text: string;
}

export function getDummyStore(): getStoreType[] {
  return [
    {
      img: SVG.shopify,
      text: "Shopify"
    },
    {
      img: SVG.amazon,
      text: "Amazon"
    },
    {
      img: SVG.rakuten,
      text: "Rakuten"
    },
    {
      img: SVG.qoo10,
      text: "Qoo10"
    },
    {
      img: SVG.shopify,
      text: "Shopify Europe"
    },
    {
      img: SVG.amazon,
      text: "Amazon Africa"
    },
    {
      img: SVG.rakuten,
      text: "Rakuten US"
    },
    {
      img: SVG.qoo10,
      text: "Qoo10"
    },
    {
      img: SVG.shopify,
      text: "Shopify Africa"
    },
    {
      img: SVG.amazon,
      text: "Amazon Australia"
    },
    {
      img: SVG.shopify,
      text: "Shopify Asia"
    },
    {
      img: SVG.amazon,
      text: "Amazon Russia"
    }
  ];
}
