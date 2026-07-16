import { PhoneShot } from "kodinav";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 460">
  <rect width="220" height="460" fill="#efeae0"/>
  <rect x="0" y="0" width="220" height="60" fill="#16140f"/>
  <rect x="16" y="26" width="60" height="10" fill="#efeae0"/>
  <rect x="16" y="92" width="150" height="22" fill="#16140f"/>
  <rect x="16" y="122" width="110" height="22" fill="#16140f"/>
  <rect x="16" y="162" width="88" height="14" fill="#ff4400"/>
  <rect x="16" y="200" width="188" height="70" fill="rgba(22,20,15,0.10)"/>
  <rect x="16" y="284" width="188" height="70" fill="rgba(22,20,15,0.10)"/>
  <rect x="16" y="368" width="188" height="70" fill="rgba(22,20,15,0.10)"/>
</svg>`;
const image = { src: "data:image/svg+xml;utf8," + encodeURIComponent(svg), alt: "Triplipi on a phone" };

export const Default = () => (
  <div className="bg-background flex justify-center p-8"><PhoneShot image={image} /></div>
);
