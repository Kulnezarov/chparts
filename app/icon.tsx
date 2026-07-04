import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

const ACCENT = "#3390EC";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8,
          background: `linear-gradient(145deg, #4aa3f0 0%, ${ACCENT} 50%, #2680d8 100%)`,
        }}
      >
        <svg width="18" height="13" viewBox="0 0 28 20" fill="none">
          <path d="M2 4H18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M5 10H22" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M2 16H26" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
