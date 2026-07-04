import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "CHParts — автозапчасти для китайских авто";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 64,
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #ff6b00 120%)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 600, opacity: 0.85, marginBottom: 16 }}>chparts.kz</div>
        <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.1, letterSpacing: -2, maxWidth: 900 }}>
          CHParts
        </div>
        <div style={{ fontSize: 32, marginTop: 20, opacity: 0.92, maxWidth: 880, lineHeight: 1.35 }}>
          Автозапчасти FAW · Changan · Dongfeng · Wuling
        </div>
        <div style={{ fontSize: 22, marginTop: 28, opacity: 0.75 }}>Доставка по Казахстану · Подбор по OEM</div>
      </div>
    ),
    { ...size },
  );
}
