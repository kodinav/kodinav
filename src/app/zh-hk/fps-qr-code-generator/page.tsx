import type { Metadata } from "next";
import { FpsQrGenerator, type FpsLabels } from "@/components/FpsQrGenerator";
import { ZhToolShell } from "@/components/zh/ZhToolShell";
import { site } from "@/data/site";
import { cjkWords } from "@/lib/cjk";
import { localeAlternates } from "@/lib/i18n";
import { ogImage } from "@/lib/og";
import { faqSchema } from "@/lib/schema";
import { SPEC_ROWS } from "@/app/(en)/(site)/fps-qr-code-generator/spec";

const path = "/zh-hk/fps-qr-code-generator";

export const metadata: Metadata = {
  title: "轉數快 QR Code 產生器｜免費生成收款碼",
  description:
    "免費轉數快（FPS）QR code 產生器：輸入 FPS ID、手機或電郵，即時生成可列印的收款 QR code，可指定金額。全部在你的瀏覽器內生成，不會上傳。",
  keywords: [
    "轉數快 qr code",
    "轉數快 qr code 生成",
    "轉數快 qr code 收款",
    "轉數快 qr code 產生器",
    "fps qr code generator",
    "fps qr code 香港",
    "收款 qr code",
    "轉數快 收錢",
  ],
  alternates: localeAlternates("fpsQr", path),
  openGraph: {
    title: "轉數快 QR Code 產生器｜免費生成收款碼",
    description: "輸入 FPS ID、手機或電郵，即時生成可列印的轉數快收款 QR code。免費，全程在瀏覽器內完成。",
    url: `${site.url}${path}`,
    type: "website",
    locale: "zh_HK",
    images: ogImage("轉數快 QR code 產生器", "免費工具"),
  },
};

const labels: FpsLabels = {
  payeeType: "客人用什麼方式轉錢給你？",
  fpsId: "FPS ID",
  fpsIdHint: "銀行發出的 7 至 9 位轉數快識別碼。",
  mobile: "手機號碼",
  mobileHint: "已登記轉數快的香港手機號碼，例如 9123 4567。",
  email: "電郵地址",
  emailHint: "已登記轉數快的電郵地址。",
  payeeValue: "你的轉數快識別碼",
  bankCode: "銀行編號（可選）",
  bankCodeHint: "3 位銀行編號。如同一手機或電郵在多間銀行登記，填寫可指定收款銀行。",
  amount: "金額（可選）",
  amountHint: "留空即為可重複使用的收款碼，由付款人自行輸入金額。",
  currency: "貨幣",
  merchantName: "顯示名稱（可選）",
  merchantNameHint: "最多 25 個字元，留空會顯示 NA。",
  billNumber: "單號／發票編號（可選）",
  billNumberHint: "英文字母、數字及連字號。部分銀行 App 未必會顯示。",
  preview: "你的轉數快 QR code",
  empty: "輸入 FPS ID、手機或電郵，QR code 就會即時出現。",
  download: "下載 PNG",
  copy: "複製內容",
  copied: "已複製",
  inside: "這個 QR code 內含什麼？",
  insideHint: "內容依照金管局及香港銀行同業結算有限公司（HKICL）公布的共用二維碼規格。",
  privacy: "全部在你的瀏覽器內生成，資料不會上傳、儲存或記錄。",
  errors: {
    "empty-payee": "請輸入 FPS ID、手機號碼或電郵。",
    "fps-id": "FPS ID 為 7 至 9 位數字。",
    mobile: "請輸入香港手機號碼，例如 9123 4567。",
    email: "電郵地址格式不正確。",
    "bank-code": "銀行編號為 3 位數字，例如 004。",
    amount: "金額格式例如 250 或 58.50。",
    "merchant-name": "顯示名稱請保持在 25 個字元以內。",
    "bill-number": "只可使用英文字母、數字及連字號。",
  },
  fieldNames: {
    "00": "格式版本",
    "01": "類型（11 = 不指定金額，12 = 指定金額）",
    "26": "轉數快收款人資料",
    "52": "商戶類別",
    "53": "貨幣",
    "54": "金額",
    "58": "國家／地區",
    "59": "顯示名稱",
    "60": "城市",
    "62": "附加資料",
    "63": "檢查碼",
  },
};

const faqs = [
  {
    q: "轉數快 QR code 點用？",
    a: "把生成的 QR code 列印出來放在收銀處、加在發票上，或直接把圖片傳給客人。客人打開銀行手機 App，選擇掃描或轉數快二維碼功能，對準 QR code，收款人資料（以及你指定的金額）便會自動填好，確認後即可過數。",
  },
  {
    q: "客人用哪些 App 掃得到？匯豐、中銀、Citibank、Mox 可以嗎？",
    a: "香港大部分銀行的手機 App 都支援掃描轉數快 QR code，不同銀行的入口位置和名稱略有分別。由於各行介面不同，正式使用前請自己先用銀行 App 掃一次，確認收款人資料正確。",
  },
  {
    q: "金額應該填定留空？",
    a: "留空就是可重複使用的收款碼，付款人自行輸入金額，適合放在店舖收銀處。填了金額則適合單一筆發票，客人掃描後會看到已填好的金額。QR code 本身會記錄屬於哪一種（11 為不指定金額，12 為指定金額）。",
  },
  {
    q: "QR code 會過期嗎？",
    a: "不會。內容中沒有有效期，只要你在銀行登記的 FPS ID、手機或電郵沒有改變，列印出來的 QR code 就一直有效。若日後取消登記，舊的 QR code 便會失效。",
  },
  {
    q: "印出來貼在店舖安全嗎？裡面有什麼資料？",
    a: "QR code 只包含付款人需要的資料：你的轉數快識別碼、貨幣、金額（如有指定）、顯示名稱及單號。當中沒有密碼、沒有登入資料，亦沒有銀行戶口號碼。本工具亦不會把你輸入的資料上傳，QR code 完全在你的瀏覽器內生成。",
  },
  {
    q: "需要商業登記或公司戶口嗎？",
    a: "只要是銀行已登記的轉數快識別碼，個人或公司戶口都可以生成 QR code。至於你的業務是否需要公司戶口、商業登記或商戶協議，請向你的銀行及稅務局查詢，本工具不提供這方面的意見。",
  },
  {
    q: "收款要手續費嗎？",
    a: "轉數快轉賬一般對個人客戶免手續費，但各銀行自行訂定條款，公司戶口的收費亦可能不同。用作生意收款前，請先查閱你銀行的收費表。",
  },
  {
    q: "同 PayMe QR code 有什麼分別？",
    a: "PayMe 有自己的 QR code 格式。本工具生成的是轉數快（FPS）QR code，應以支援轉數快的銀行 App 掃描。",
  },
  {
    q: "這是官方工具嗎？",
    a: "不是。這是 Kodinav 按公開規格製作的免費工具，與 HKICL、金管局及任何銀行均無關聯。正式使用前，請自行掃描測試並確認收款人資料。",
  },
];

export default function ZhHkFpsQrPage() {
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "轉數快 QR code 產生器",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      inLanguage: "zh-HK",
      url: `${site.url}${path}`,
      description: "免費生成香港轉數快（FPS）收款 QR code，支援 FPS ID、手機及電郵。",
      provider: { "@id": `${site.url}/#studio` },
      offers: { "@type": "Offer", price: "0", priceCurrency: "HKD" },
    },
    faqSchema(faqs),
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "首頁", item: `${site.url}/zh-hk` },
        { "@type": "ListItem", position: 2, name: "轉數快 QR code 產生器", item: `${site.url}${path}` },
      ],
    },
  ];

  return (
    <>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <ZhToolShell
        breadcrumb={{ home: { name: "首頁", href: "/zh-hk" }, current: "轉數快 QR code 產生器" }}
        eyebrow="免費轉數快 QR 產生器"
        title={
          <>
            {cjkWords("轉數快 QR code，", "zh-HK")}
            <span className="text-gradient inline-block">{cjkWords("即刻生成。", "zh-HK")}</span>
          </>
        }
        lead="輸入 FPS ID、手機號碼或電郵，即時生成客人可以用銀行 App 掃描的轉數快收款 QR code。可指定金額，亦可留空重複使用；所有資料只在你的瀏覽器內處理。"
        tool={<FpsQrGenerator labels={labels} />}
        middle={
          <section className="border-t border-line-strong">
            <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
              <h2 className="text-2xl sm:text-3xl">{cjkWords("QR code 內容規格。", "zh-HK")}</h2>
              <p className="mt-3 max-w-3xl text-sm leading-[1.9] text-muted">
                內容依照金管局與香港銀行同業結算有限公司（HKICL）公布的《香港零售支付共用二維碼規格》，
                即 EMVCo 商戶顯示二維碼加上香港收款人範本。檢查碼採用 CRC-16/CCITT-FALSE，涵蓋整段內容。
              </p>
              <div className="mt-8 overflow-x-auto">
                <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-line-strong">
                      <th className="annotation py-3 pr-4 font-normal">ID</th>
                      <th className="annotation py-3 font-normal">內容</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SPEC_ROWS.map((row) => (
                      <tr key={row.id} className="border-b border-line">
                        <th scope="row" className="py-3 pr-4 font-mono text-xs font-normal text-foreground">
                          {row.id}
                        </th>
                        <td className="py-3 text-muted">{row.zh}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        }
        faqTitle="關於轉數快 QR code 的常見問題。"
        faqs={faqs}
        funnel={{
          eyebrow: "想在網站直接收款？",
          body: "這個工具永久免費。如果你想在自己的網店或網站收取轉數快、信用卡或電子錢包付款，Kodinav 可以為你設計及開發。",
          label: "了解網店開發服務",
          href: "/zh-hk",
        }}
        related={{
          title: "延伸閱讀",
          links: [
            { label: "香港開網店指南：商業登記、平台、收款", href: "/zh-hk/online-shop-guide" },
            { label: "2026 香港網站設計收費指南", href: "/zh-hk/website-cost" },
            { label: "香港利得稅計算機", href: "/zh-hk/profits-tax-calculator" },
            { label: "香港網頁設計及網站開發", href: "/zh-hk" },
            { label: "FPS QR Code Generator (English)", href: "/fps-qr-code-generator" },
          ],
        }}
      />
    </>
  );
}
