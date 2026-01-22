import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="ec-wrap" style={{ minHeight: "100vh", display: "grid", alignContent: "center" }}>
      <header className="ec-topbar">
        <div />
        <Link href="/info" aria-label="Information" className="ec-icon">
          i
        </Link>
      </header>

      <section className="ec-card">
        <div style={{ display: "grid", justifyItems: "center", gap: 14 }}>
          <div style={{ width: 240, height: 240, borderRadius: 24, overflow: "hidden" }}>
            <Image src="/logo.png" alt="annetmii English Camp" width={240} height={240} priority />
          </div>

          {/* ここから中央揃えブロック */}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontWeight: 900, fontSize: 22 }}>
              anne<span style={{ color: "#ec0f02" }}>t</span>mii English Camp
            </div>

            <div
              style={{
                marginTop: 10,
                maxWidth: 320,
                marginLeft: "auto",
                marginRight: "auto",
                opacity: 0.78,
                fontSize: "clamp(13px, 3.6vw, 16px)",
                lineHeight: 1.35,
                letterSpacing: "0.2px",
              }}
            >
              <div>Practice English for Real Work</div>
              <div>15 minutes. One scene. Real output.</div>
            </div>

            <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: 10 }}>
              <Link href="/home" className="ec-btn" style={{ textDecoration: "none", minWidth: 200, textAlign: "center" }}>
                Start
              </Link>
            </div>
          </div>
          {/* ここまで */}
        </div>
      </section>
    </main>
  );
}