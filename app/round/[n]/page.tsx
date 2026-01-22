import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import RoundClient from "@/components/RoundClient";
import { CHARACTERS, getRound } from "@/components/content";

export default function RoundPage({
  params,
  searchParams,
}: {
  params: Promise<{ n: string }>;
  searchParams: Promise<{ scene?: string }>;
}) {
  return (
    <Suspense fallback={<main style={wrap}>Loading...</main>}>
      <RoundInner params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function RoundInner({
  params,
  searchParams,
}: {
  params: Promise<{ n: string }>;
  searchParams: Promise<{ scene?: string }>;
}) {
  const { n } = await params;
  const { scene } = await searchParams;

  const roundN = Number(n);
  const sceneN = Number(scene ?? "1") || 1;

  const round = getRound(sceneN, roundN);

  if (!round) {
    return (
      <main style={wrap}>
        <header className="ec-topbar">
          <Link href="/home" className="ec-pill">
            Home
          </Link>

          <Link href="/info" aria-label="Information" className="ec-icon">
            i
          </Link>
        </header>

<h1 style={{ margin: 0 }}>Round not found</h1>
<div style={{ marginTop: 10 }}>
  <Link href="/home" className="ec-pill">
    Back
  </Link>
</div>
      </main>
    );
  }

  const character = CHARACTERS[round.characterId];

  const backHref =
    roundN === 1 ? `/summary?scene=${sceneN}` : `/round/${roundN - 1}?scene=${sceneN}`;
  const nextHref =
    roundN === 3 ? `/summary?scene=${sceneN}` : `/round/${roundN + 1}?scene=${sceneN}`;

  return (
    <main style={wrap}>
      <header className="ec-topbar">
        <Link href="/home" className="ec-pill">
          Home
        </Link>

        <Link href="/info" aria-label="Information" className="ec-icon">
          i
        </Link>
      </header>

<section style={card}>
  {/* Scene をヘッダーとして独立させる */}
  <div style={{ fontWeight: 900, fontSize: 20, marginBottom: 8, letterSpacing: "0.2px" }}>
    Scene {sceneN}
  </div>

  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
    <div style={avatarFrame}>
      <Image src={character.img} alt={character.name} width={72} height={72} />
    </div>
    <div style={{ display: "grid", gap: 4 }}>
      <div style={{ fontWeight: 800, fontSize: 16 }}>Round {round.n} / 3</div>
      <div style={{ opacity: 0.85 }}>{character.name}</div>
    </div>
  </div>

        <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
          <div>
            <div style={label}>シチュエーション</div>
            <div style={{ opacity: 0.92 }}>{round.situationJa}</div>
          </div>

          <div>
            <div style={label}>相手のセリフ</div>
<div style={{ opacity: 0.92, fontSize: 16, fontWeight: 600, lineHeight: 1.5 }}>
  {round.partnerLineEn}
</div>
          </div>
        </div>

        <RoundClient round={round} sceneN={sceneN} />

<div
  style={{
    marginTop: 14,
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
  }}
>
  <Link href={backHref} className="ec-pill">
    Back
  </Link>

  <Link href={nextHref} className="ec-pill">
    {roundN === 3 ? "Go to Summary" : "Next Round"}
  </Link>
</div>
      </section>
    </main>
  );
}

const wrap: React.CSSProperties = { maxWidth: 720, margin: "0 auto", padding: 16 };

const card: React.CSSProperties = {
  marginTop: 12,
  border: "1px solid rgba(0,0,0,0.12)",
  borderRadius: 16,
  padding: 14,
  background: "white",
};

const label: React.CSSProperties = { fontSize: 12, opacity: 0.7, marginBottom: 4 };

const avatarFrame: React.CSSProperties = {
  width: 72,
  height: 72,
  borderRadius: 16,
  overflow: "hidden",
  border: "1px solid rgba(0,0,0,0.12)",
};

const linkStyle: React.CSSProperties = {
  textDecoration: "none",
  border: "1px solid rgba(0,0,0,0.12)",
  padding: "8px 10px",
  borderRadius: 10,
};