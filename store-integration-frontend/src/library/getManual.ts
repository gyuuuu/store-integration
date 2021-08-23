// cSpell:ignore rakuten,
import SVG from "@/library/importSVG";

export function getAmazonManual() {
  return [
    {
      img: SVG.AmazonManual1,
      text:
        "② axB가 접근하려는 정보를 확인한 뒤, 체크박스 체크 후 Confirm 버튼을 눌러주세요"
    },
    {
      img: SVG.AmazonManual2,
      text: "③ 연동 중 화면입니다. 기다려주세요"
    },
    {
      img: SVG.AmazonManual3,
      text:
        "④ 연동이 완료되면, 하단의 TOKEN 확인버튼을 클릭하여 TOKEN 유효성 검사를 진행해주세요"
    }
  ];
}

export function getRakutenManual() {
  return [
    {
      img: SVG.Manual1,
      text:
        "② RMS 페이지에서 점포님을 위한 정보서비스 - WEB API 서비스를 클릭해주세요"
    },
    {
      img: SVG.Manual2,
      text: "③ 해당 페이지에서 WEB API를 클릭해주세요"
    },
    {
      img: SVG.Manual3,
      text:
        "④ 해당 페이지의 licenseKey, serviceSecret (API KEY), 유효기간 값을 복사해 아래에 붙여 넣어주세요."
    }
  ];
}

export function getShopifyManual() {
  return [
    {
      img: SVG.ShopifyManual1,
      text:
        "② axB가 접근하려는 정보를 확인한 뒤, 체크박스 체크 후 Confirm 버튼을 눌러주세요"
    },
    {
      img: SVG.ShopifyManual2,
      text:
        "③ 연동이 완료되면, 하단의 TOKEN 확인버튼을 클릭하여 TOKEN 유효성 검사를 진행해주세요"
    }
  ];
}
