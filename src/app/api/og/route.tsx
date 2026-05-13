import { ImageResponse } from "next/og";

export const runtime = "edge";

const BG = "#0a0a0a";
const ACCENT = "#D35400";
const FG = "#ffffff";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title")?.slice(0, 120) ?? "Africa Centred Technology";
  const subtitle = searchParams.get("subtitle")?.slice(0, 60) ?? "Engineering the Future";
  const accent = searchParams.get("accent") ?? ACCENT;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: BG,
          color: FG,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px 100px",
          fontFamily: "Outfit",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              background: accent,
              color: BG,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 800,
            }}
          >
            A
          </div>
          <span style={{ fontSize: 28, fontWeight: 600, letterSpacing: 1 }}>ACT</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <span style={{ color: accent, fontSize: 26, textTransform: "uppercase", letterSpacing: 2 }}>
            {subtitle}
          </span>
          <span style={{ fontSize: 72, lineHeight: 1.1, fontWeight: 700, maxWidth: 980 }}>
            {title}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            opacity: 0.7,
          }}
        >
          <span>a-ct.ma</span>
          <div style={{ width: 120, height: 4, background: accent }} />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: { "cache-control": "public, max-age=86400, s-maxage=86400, immutable" },
    }
  );
}
