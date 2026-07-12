import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "DOKI - 뷰티 스타일 발견하기";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#ffffff",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
        }}
      >
        <img
          src="https://www.dayofkidol.shop/thumbnail.png"
          style={{ width: 600 }}
        />
      </div>
    ),
    size
  );
}
