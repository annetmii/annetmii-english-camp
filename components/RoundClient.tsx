"use client";

import { useEffect, useMemo, useState } from "react";
import TapTwoSentenceBuilder from "@/components/TapTwoSentenceBuilder";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import type { RoundContent } from "@/components/content";
import { computeCurrentScene, setSceneToStorage, getSceneFromStorage } from "@/lib/scene";

export default function RoundClient({ round, sceneN }: { round: RoundContent; sceneN: number }) {
  const supabase = useMemo(() => supabaseBrowser(), []);

  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [savedRow, setSavedRow] = useState<any | null>(null);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "error">("idle");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      const email = user?.email ?? null;
      setSessionEmail(email);

      if (!user) return;
// Homeを経由しないアクセスでもSceneがズレないようにする
const current = await computeCurrentScene(supabase, user.id);
setSceneToStorage(current);

      setLoadState("loading");
      const { data: row, error } = await supabase
        .from("submissions")
        .select("*")
        .eq("user_id", user.id)
        .eq("scene_n", sceneN)
        .eq("round_n", round.n)
        .maybeSingle();

      if (error) {
        console.log("LOAD ERROR", error);
        setLoadState("error");
        return;
      }

      setSavedRow(row ?? null);
      setLoadState("idle");
    })();
  }, [supabase, round.n]);

  if (!sessionEmail) {
    return (
      <section
        style={{
          marginTop: 12,
          border: "1px solid rgba(0,0,0,0.12)",
          borderRadius: 16,
          padding: 14,
        }}
      >
        <div style={{ fontWeight: 700 }}>ログインが必要です</div>
        <div style={{ opacity: 0.85, marginTop: 6 }}>/login からログインしてください。</div>
      </section>
    );
  }

  // ここは後でRound定義に移せます。今は表示が崩れない最小固定。
  const jpSupplementS1 = "懸念点を端的に伝える（何が問題かを明確にする）。";
  const jpSupplementS2 = "対応策を提案する（次に何をするかを示す）。";

  const handleSubmit = async (payload: {
    answer1: string;
    answer2: string;
    isCorrect: boolean;
    wrongTokens: string[];
  }) => {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;

    if (!user) {
      alert("Not signed in");
      return;
    }

    const { data: upserted, error } = await supabase
      .from("submissions")
      .upsert(
        {
          user_id: user.id,
          scene_n: sceneN,
          round_n: round.n,
          status: payload.isCorrect ? "Correct" : "Almost",
          sentence1_built: payload.answer1,
          sentence2_built: payload.answer2,
        },
        { onConflict: "user_id,scene_n,round_n" }
      )
      .select("*")
      .single();

    if (error) {
      console.log("UPSERT ERROR", error);
      alert(`Save failed: ${error.message}`);
      return;
    }

    setSavedRow(upserted);
  };

  return (
    <section style={{ marginTop: 12 }}>
      <TapTwoSentenceBuilder
        target1={round.targetTokens1}
        target2={round.targetTokens2}
        extra={round.extraTokens}
        onSubmit={handleSubmit}
      />

      {savedRow && (
        <div
          style={{
            marginTop: 14,
            border: "1px solid rgba(0,0,0,0.12)",
            borderRadius: 16,
            padding: 14,
            display: "grid",
            gap: 10,
          }}
        >

          <div style={{ opacity: 0.92 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>判定</div>
            <div>{savedRow.status}</div>
          </div>

          <div style={{ opacity: 0.92 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>正解</div>
            <div style={{ whiteSpace: "pre-wrap" }}>
              {round.targetTokens1.join(" ")}
              {"\n"}
              {round.targetTokens2.join(" ")}
            </div>
          </div>

          <div style={{ opacity: 0.92 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>ヒント</div>
            <div style={{ whiteSpace: "pre-wrap" }}>
              セリフ①：{jpSupplementS1}
              {"\n"}
              セリフ②：{jpSupplementS2}
            </div>
          </div>

          <div style={{ opacity: 0.92 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>講師コメント</div>
            <div style={{ whiteSpace: "pre-wrap" }}>
              {loadState === "loading"
                ? "Loading..."
                : savedRow.coach_comment
                ? savedRow.coach_comment
                : "まだありません"}
            </div>
          </div>

          <div style={{ fontSize: 12, opacity: 0.65 }}>
            保存状況: {savedRow ? "Saved" : "Not saved yet"}
          </div>
        </div>
      )}
    </section>
  );
}