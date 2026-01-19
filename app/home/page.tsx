"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { computeCurrentScene, setSceneToStorage } from "@/lib/scene";

const TEACHER_EMAIL = "hello@annetmii.com";

export default function HomePage() {
  const supabase = useMemo(() => supabaseBrowser(), []);

  const [email, setEmail] = useState<string | null>(null);
  const [isCoach, setIsCoach] = useState(false);
  const [sceneN, setSceneN] = useState(1);
  const [dateStr, setDateStr] = useState("");

  // 重要：hooksは必ずトップレベルで固定（条件分岐の前）
  useEffect(() => {
    (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;

      const userEmail = user?.email ?? null;
      setEmail(userEmail);
      setIsCoach(userEmail === TEACHER_EMAIL);

      if (!user) return;

// 日付は render 中ではなく mount 後に入れる
const now = new Date();
const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
setDateStr(jst.toISOString().slice(0, 10));      
const n = await computeCurrentScene(supabase, user.id);
      setSceneN(n);
      setSceneToStorage(n);
    })();
  }, [supabase]);

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  // UI（ここから下はhooks無し）
  if (!email) {
    return (
      <main style={wrap}>
        <header style={topbar}>
          <div />
          <Link href="/info" style={pill}>
            i
          </Link>
        </header>

        <section style={card}>
          <div style={{ fontWeight: 800, fontSize: 18 }}>Home</div>
          <div style={{ marginTop: 8, opacity: 0.85 }}>ログインしてください</div>

          <div style={{ marginTop: 14 }}>
            <Link href="/login" style={primary}>
              Sign in
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main style={wrap}>
      <header style={topbar}>
        <button onClick={signOut} className="ec-pill" type="button">
          Sign out
        </button>

        <Link href="/info" className="ec-icon" aria-label="Information">
          i
        </Link>
      </header>

      <section style={card}>
        <div style={{ fontWeight: 800, fontSize: 18 }}>Home</div>

        <div style={grid2}>
          <Link href={`/round/1?scene=${sceneN}`} style={boxLink}>
            <div style={{ fontWeight: 800 }}>続きから学ぶ</div>
            <div style={{ marginTop: 6, opacity: 0.85 }}>Scene {sceneN} Round 1から開始</div>
          </Link>

          <Link href={`/summary?scene=${sceneN}`} style={boxLink}>
            <div style={{ fontWeight: 800 }}>振り返る</div>
            <div style={{ marginTop: 6, opacity: 0.85 }}>提出履歴</div>
          </Link>

          {isCoach ? (
            <Link href="/coach" style={boxLink}>
              <div style={{ fontWeight: 800 }}>Coach</div>
              <div style={{ marginTop: 6, opacity: 0.85 }}>提出内容の確認とコメント</div>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </section>
    </main>
  );
}

const wrap: React.CSSProperties = { maxWidth: 720, margin: "0 auto", padding: 16 };

const topbar: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
};

const card: React.CSSProperties = {
  marginTop: 12,
  border: "1px solid rgba(0,0,0,0.12)",
  borderRadius: 16,
  padding: 14,
};

const grid2: React.CSSProperties = {
  marginTop: 12,
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 12,
};

const boxLink: React.CSSProperties = {
  border: "1px solid rgba(0,0,0,0.12)",
  borderRadius: 16,
  padding: 14,
  textDecoration: "none",
  color: "inherit",
  display: "block",
  minHeight: 92,
};

const PILL_H = 44;

const pillButton: React.CSSProperties = {
  height: PILL_H,
  minHeight: PILL_H,
  padding: "0 16px",
  borderRadius: 999,
  border: "1px solid rgba(0,0,0,0.15)",
  background: "white",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  fontWeight: 800,
  lineHeight: 1,
};

const pill: React.CSSProperties = {
  width: PILL_H,
  height: PILL_H,
  borderRadius: 999,
  border: "1px solid rgba(0,0,0,0.15)",
  background: "white",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  fontWeight: 900,
  lineHeight: 1,
};

const primary: React.CSSProperties = {
  height: PILL_H,
  minHeight: PILL_H,
  padding: "0 16px",
  borderRadius: 999,
  border: "1px solid rgba(0,0,0,0.15)",
  background: "white",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  fontWeight: 800,
  lineHeight: 1,
};