"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

type Row = {
  id: number;
  user_id: string;
  scene_n: number;
  round_n: number;
  status: string | null;
  sentence1_built: string | null;
  sentence2_built: string | null;
  coach_comment: string | null;
  created_at: string;
};

function fmt(ts: string) {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export default function SummaryPage() {
  const supabase = useMemo(() => supabaseBrowser(), []);
  const [rows, setRows] = useState<Row[]>([]);
  const [scene, setScene] = useState<number>(1);
  const [state, setState] = useState<"loading" | "idle" | "error">("loading");

  const load = async () => {
    setState("loading");
    const { data: session } = await supabase.auth.getSession();
    const user = session.session?.user;
    if (!user) {
      setRows([]);
      setState("idle");
      return;
    }

    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .eq("user_id", user.id)
      .order("scene_n", { ascending: true })
      .order("round_n", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      setState("error");
      return;
    }

    setRows((data ?? []) as Row[]);
    setState("idle");
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scenes = Array.from(new Set(rows.map((r) => r.scene_n))).sort(
    (a, b) => a - b
  );
  const filtered = rows.filter((r) => r.scene_n === scene);

  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: 16 }}>
      <header className="ec-topbar">
        <Link href="/home" className="ec-pill">
          Home
        </Link>
        <Link href="/info" className="ec-icon" aria-label="Information">
          i
        </Link>
      </header>

<section
  style={{
    border: "1px solid rgba(0,0,0,0.12)",
    borderRadius: 16,
    padding: 14,
    background: "white",
    marginTop: 12,
  }}
>
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 10,
    }}
  >
    <div style={{ fontWeight: 800, fontSize: 18 }}>Summary</div>

    <Link href={`/round/1?scene=${scene}`} className="ec-pill">
      Retry
    </Link>
  </div>

  <div style={{ marginTop: 10, display: "flex", gap: 10, alignItems: "center" }}>
    <div style={{ fontWeight: 700 }}>Scene</div>

    {scenes.length === 0 ? (
      <span style={{ opacity: 0.7 }}>まだ提出がありません</span>
    ) : (
      <select
        value={scene}
        onChange={(e) => setScene(Number(e.target.value))}
        style={{
          border: "1px solid rgba(0,0,0,0.12)",
          borderRadius: 12,
          padding: "8px 12px",
        }}
      >
        {scenes.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
    )}
  </div>
</section>

      <section
        style={{
          border: "1px solid rgba(0,0,0,0.12)",
          borderRadius: 16,
          padding: 14,
          background: "white",
          marginTop: 14,
        }}
      >

        {state === "loading" ? (
          <div>Loading...</div>
        ) : state === "error" ? (
          <div>Load failed</div>
        ) : filtered.length === 0 ? (
          <div style={{ opacity: 0.7 }}>このSceneはまだ提出がありません</div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {[1, 2, 3].map((rn) => {
              const r = filtered.find((x) => x.round_n === rn);
              return (
                <div
  key={rn}
  style={{
    border: "1px solid rgba(0,0,0,0.12)",
    borderRadius: 14,
    padding: 12,
    background:
      r?.status === "Correct"
        ? "rgba(0, 128, 0, 0.06)"
        : r?.status === "Almost"
        ? "rgba(255, 0, 0, 0.06)"
        : "white",
  }}
>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <strong>Round {rn}</strong>
                    <strong>{r?.status ?? "Not submitted"}</strong>
                  </div>

                  {r && (
                    <>
                      <pre style={{ marginTop: 8 }}>
{r.sentence1_built}
{`\n`}
{r.sentence2_built}
                      </pre>

                      <div style={{ fontSize: 12, opacity: 0.7 }}>
                        提出日時: {fmt(r.created_at)}
                      </div>

                      <div style={{ marginTop: 6 }}>
                        講師コメント:{" "}
                        {r.coach_comment ?? "まだありません"}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}