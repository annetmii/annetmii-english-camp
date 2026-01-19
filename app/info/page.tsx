import Image from "next/image";
import Link from "next/link";

export default function InfoPage() {
  return (
    <main className="ec-wrap">
      <header className="ec-topbar">
        <Link href="/" className="ec-pill">
          Back
        </Link>

        <Link href="/login" className="ec-pill">
          Sign in
        </Link>
      </header>

      <section className="ec-card">
        <div style={{ marginTop: 6 }}>
          <div style={sectionTitle}>登場人物</div>

          <div style={grid3}>
<PersonCard img="/manager.png" name="Manager" role="上司" desc="報告・提案の相手" />
<PersonCard img="/colleague.png" name="Colleague" role="同僚" desc="状況共有・相談の相手" />
<PersonCard img="/staff.png" name="Staff" role="部下" desc="依頼・調整・協力要請の相手" />
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          <div style={sectionTitle}>使い方</div>

 <ol style={{ marginTop: 8, paddingLeft: 18, lineHeight: 1.6 }}>
  <li>1. Home から「続きから学ぶ」を開く</li>
  <li>2. 単語チップをタップしてセリフを組み立てる</li>
  <li>3. Submit を押す（解答は自動で保存されます）</li>
  <li>4. 提出後に、正解文・日本語補足・講師コメントを確認</li>
</ol>

<p style={{ marginTop: 12, lineHeight: 1.6 }}>
  実際の職場を想定したリアルなシーンで、<br />
  3人の登場人物（上司・同僚・部下）とのやり取りを通して、<br />
  英文の「伝わる構造」を身につけます。
</p>
        </div>

        <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
          <Link href="/home" className="ec-btn" style={{ textDecoration: "none" }}>
            Start
          </Link>
        </div>
      </section>
    </main>
  );
}

function PersonCard({
  img,
  name,
  role,
  desc,
}: {
  img: string;
  name: string;
  role: string;
  desc: string;
}) {
  return (
    <div style={personCard}>
      <div style={avatarFrame}>
        <Image src={img} alt={name} width={84} height={84} />
      </div>

      <div style={{ fontWeight: 800, marginTop: 8 }}>{name}</div>
      <div style={{ opacity: 0.75, fontSize: 12, marginTop: 2 }}>{role}</div>

      <div
        style={{
          marginTop: 6,
          fontSize: 12,
          opacity: 0.7,
          lineHeight: 1.4,
          textAlign: "center",
        }}
      >
        {desc}
      </div>
    </div>
  );
}

const sectionTitle: React.CSSProperties = {
  fontWeight: 900,
  marginBottom: 6,
};

const grid3: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: 10,
};

const personCard: React.CSSProperties = {
  border: "1px solid rgba(0,0,0,0.10)",
  borderRadius: 16,
  padding: 12,
  display: "grid",
  justifyItems: "center",
};

const avatarFrame: React.CSSProperties = {
  width: 84,
  height: 84,
  borderRadius: 18,
  overflow: "hidden",
  display: "grid",
  placeItems: "center",
};