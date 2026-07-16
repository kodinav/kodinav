import { ProjectShot } from "kodinav";

// Self-contained stand-in for a real project screenshot, drawn in the studio
// palette so the frame's chrome and caption read true.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400">
  <rect width="640" height="400" fill="#efeae0"/>
  <rect x="0" y="0" width="640" height="52" fill="#16140f"/>
  <rect x="24" y="20" width="90" height="12" fill="#efeae0"/>
  <rect x="470" y="18" width="146" height="18" fill="#ff4400"/>
  <rect x="40" y="104" width="380" height="34" fill="#16140f"/>
  <rect x="40" y="150" width="300" height="34" fill="#16140f"/>
  <rect x="40" y="196" width="120" height="16" fill="#ff4400"/>
  <rect x="40" y="240" width="560" height="1" fill="rgba(22,20,15,0.25)"/>
  <rect x="40" y="266" width="170" height="94" fill="rgba(22,20,15,0.10)"/>
  <rect x="235" y="266" width="170" height="94" fill="rgba(22,20,15,0.10)"/>
  <rect x="430" y="266" width="170" height="94" fill="rgba(22,20,15,0.10)"/>
</svg>`;
const image = { src: "data:image/svg+xml;utf8," + encodeURIComponent(svg), alt: "Triplipi travel platform homepage" };

export const Default = () => (
  <div className="bg-background p-8"><ProjectShot image={image} /></div>
);

export const WithCaption = () => (
  <div className="bg-background p-8"><ProjectShot image={image} caption="Triplipi" /></div>
);
