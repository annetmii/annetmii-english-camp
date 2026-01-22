"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
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

const COACH_EMAIL = "hello@annetmii.com";

export default function CoachPage() {
  const supabase = useMemo(() => supabaseBrowser(), []);
  const [email, setEmail] = useState<string | null>(null);

  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [rows, setRows] = useState<Row[]>([]);
  const [scene, setScene] = useState<number>(1);

  const load = async () => {
    setState("loading");
    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
      setState("error");
      return;
    }

    // 同じ (scene_n, round_n, user_id) が複数ある場合は最新だけ残す
    const map = new Map<string, Row>();
    for (const r of (data ?? []) as Row[]) {
      const key = `${r.user_id}:${r.scene_n}:${r.round_n}`;
      if (!map.has(key)) map.set(key, r);
    }

    const latest = Array.from(map.values()).sort((a, b) => {
      if (a.scene_n !== b.scene_n) return a.scene_n - b.scene_n;
      if (a.round_n !== b.round_n) return a.round_n - b.round_n;
      return a.id - b.id;
    });

    setRows(latest);
    setState("idle");
  };

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      const e = data.session?.user.email ?? null;
      setEmail(e);
      await load();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  const sceneCandidates = useMemo(() => {
    const set = new Set<number>();
    rows.forEach((r) => set.add(r.scene_n));
    const list = Array.from(set.values()).sort((a, b) => a - b);
    return list.length ? list : [1];
  }, [rows]);

  useEffect(() => {
    // 既存データにない scene を選んでいたら、存在する最小に寄せる
    if (!sceneCandidates.includes(scene)) setScene(sceneCandidates[0]);
  }, [sceneCandidates, scene]);

  const sceneRows = rows.filter((r) => r.scene_n === scene);

  const saveComment = async (id: number, coach_comment: string) => {
    const { error } = await supabase
      .from("submissions")
      .update({ coach_comment })
      .eq("id", id);

    if (error) {
      alert(`Save failed: ${error.message}`);
      return;
    }
    await load();
  };

  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: 16 }}>
      <header className="ec-topbar">
        <Link href="/home" className="ec-pill">
          Home
        </Link>
        <Link href="/summary" className="ec-pill">
          Summary
        </Link>
      </header>

      {email && email !== COACH_EMAIL && (
        <div
          style={{
            border: "1px solid rgba(0,0,0,0.12)",
            borderRadius: 14,
            padding: 12,
            marginBottom: 12,
            background: "rgba(255, 0, 0, 0.04)",
          }}
        >
          講師アカウントではありません（{email}）
        </div>
      )}

      <section
        style={{
          marginTop: 12,
          border: "1px solid rgba(0,0,0,0.12)",
          borderRadius: 16,
          padding: 14,
          display: "flex",
          gap: 10,
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ fontWeight: 700 }}>Scene</div>
          <select
            value={scene}
            onChange={(e) => setScene(Number(e.target.value))}
            style={{
              border: "1px solid rgba(0,0,0,0.12)",
              borderRadius: 12,
              padding: "10px 12px",
              fontSize: 14,
            }}
          >
            {sceneCandidates.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>

          <button
            onClick={load}
            className="ec-pill"
            style={{ cursor: "pointer", background: "transparent" }}
          >
            Reload
          </button>
        </div>

        <div style={{ fontSize: 12, opacity: 0.75 }}>
          {state === "loading" ? "Loading..." : state === "error" ? "Load failed" : ""}
        </div>
      </section>

      <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
        {[1, 2, 3].map((rn) => {
          const row = sceneRows.find((r) => r.round_n === rn) ?? null;

          return (
            <section
              key={rn}
              style={{
                border: "1px solid rgba(0,0,0,0.12)",
                borderRadius: 16,
                padding: 14,
              }}
            >
              <div style={{ fontWeight: 800, marginBottom: 6 }}>Round {rn}</div>

              {!row ? (
                <div style={{ opacity: 0.75 }}>まだ提出がありません</div>
              ) : (
                <div style={{ display: "grid", gap: 10 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <span
                      style={{
                        border: "1px solid rgba(0,0,0,0.12)",
background:
      row.status === "Correct"
        ? "rgba(0,128,0,0.08)"   // 薄緑
        : row.status === "Almost"
        ? "rgba(255,0,0,0.08)"   // 薄赤
        : "transparent",
                        borderRadius: 999,
                        padding: "8px 10px",
                        fontSize: 13,
                      }}
                    >
                      判定: {row.status ?? "-"}
                    </span>
                    <span style={{ fontSize: 12, opacity: 0.7 }}>
                      提出: {new Date(row.created_at).toLocaleString()}
                    </span>
                  </div>

                  <div style={{ display: "grid", gap: 6 }}>
                    <div style={{ fontSize: 12, opacity: 0.7 }}>学習者の回答</div>
                    <div style={{ whiteSpace: "pre-wrap" }}>
                      {row.sentence1_built ?? ""}
                      {"\n"}
                      {row.sentence2_built ?? ""}
                    </div>
                  </div>

                  <div style={{ display: "grid", gap: 6 }}>
                    <div style={{ fontSize: 12, opacity: 0.7 }}>講師コメント（任意）</div>
                    <textarea
                      defaultValue={row.coach_comment ?? ""}
                      placeholder="ここにコメント（任意）"
                      rows={3}
                      style={{
                        width: "100%",
                        border: "1px solid rgba(0,0,0,0.12)",
                        borderRadius: 12,
                        padding: 10,
                        fontSize: 14,
                      }}
                      onBlur={(e) => saveComment(row.id, e.target.value)}
                    />
                    <div style={{ fontSize: 12, opacity: 0.6 }}>
                      入力後、フォーカスを外すと保存します
                    </div>
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </main>
  );
}