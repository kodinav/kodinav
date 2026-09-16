/** The EMV data objects this generator writes — shown on both language pages. */
export const SPEC_ROWS = [
  { id: "00", field: "Payload format indicator", value: "01", zh: "格式版本" },
  { id: "01", field: "Point of initiation", value: "11 without an amount, 12 with one", zh: "類型（11 = 不指定金額，12 = 指定金額）" },
  { id: "26", field: "FPS payee template", value: "00 hk.com.hkicl · 01 bank code · 02 FPS ID · 03 mobile · 04 email", zh: "轉數快收款人資料：00 hk.com.hkicl、01 銀行編號、02 FPS ID、03 手機、04 電郵" },
  { id: "52", field: "Merchant category code", value: "0000", zh: "商戶類別（0000 = 未分類）" },
  { id: "53", field: "Transaction currency", value: "344 (HKD) or 156 (CNY)", zh: "貨幣：344（港元）或 156（人民幣）" },
  { id: "54", field: "Transaction amount", value: "Only when you set one", zh: "金額（只在指定金額時出現）" },
  { id: "58", field: "Country code", value: "HK", zh: "國家／地區代碼" },
  { id: "59", field: "Merchant name", value: "Your display name, or NA", zh: "顯示名稱，留空為 NA" },
  { id: "60", field: "Merchant city", value: "HK", zh: "城市" },
  { id: "62", field: "Additional data", value: "01 bill / invoice number, when set", zh: "附加資料：01 單號（如有填寫）" },
  { id: "63", field: "Checksum", value: "CRC-16/CCITT-FALSE over the whole payload", zh: "檢查碼：CRC-16/CCITT-FALSE，涵蓋整段內容" },
] as const;
