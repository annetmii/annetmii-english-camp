"use client";

import { useEffect, useMemo, useState } from "react";
import TapTwoSentenceBuilder from "@/components/TapTwoSentenceBuilder";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import type { RoundContent } from "@/components/content";
import { SCENE_CHUNKS, getSceneRoles } from "@/components/content";
import { computeCurrentScene, setSceneToStorage } from "@/lib/scene";

export default function RoundClient({
  round,
  sceneN,
}: {
  round: RoundContent;
  sceneN: number;
}) {
  const supabase = useMemo(() => supabaseBrowser(), []);
  const chunk = SCENE_CHUNKS[sceneN];
  const roles = getSceneRoles(sceneN);

  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [savedRow, setSavedRow] = useState<any | null>(null);
  const [loadState, setLoadState] =
    useState<"idle" | "loading" | "error">("idle");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      setSessionEmail(user?.email ?? null);

      if (!user) return;

      // Home を経由しない場合も Scene を DB 基準で補正
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

      if (!error) setSavedRow(row ?? null);
      setLoadState("idle");
    })();
  }, [supabase, round.n, sceneN]);

  if (!sessionEmail) {
    return (
      <section style={{ marginTop: 12 }}>
        <strong>ログインが必要です</strong>
      </section>
    );
  }

  const handleSubmit = async (payload: {
    answer1: string;
    answer2: string;
    isCorrect: boolean;
    wrongTokens: string[];
  }) => {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    if (!user) return;

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

    if (!error) setSavedRow(upserted);
  };

  return (
    <section style={{ marginTop: 12 }}>
      <TapTwoSentenceBuilder
        target1={round.targetTokens1}
        target2={round.targetTokens2}
        extra={round.extraTokens}
        onSubmit={handleSubmit}
        sentence1RoleJa={roles.s1}
        sentence2RoleJa={roles.s2}
      />

      <div
        style={{
          marginTop: 14,
          border: "1px solid rgba(0,0,0,0.12)",
          borderRadius: 16,
          padding: 14,
          background:
            savedRow?.status === "Correct"
              ? "rgba(0,128,0,0.06)"
              : savedRow?.status === "Almost"
              ? "rgba(255,0,0,0.06)"
              : "white",
        }}
      >
        <div style={{ fontWeight: 800 }}>
          {chunk?.title ?? "今回使うチャンク"}
        </div>

        {chunk?.lines.map((line: string, i: number) => (
  <div
    key={i}
    style={{
      fontSize: 16,
      lineHeight: 1.5,
      fontWeight: 700,
      letterSpacing: "0.2px",
    }}
  >
            {line}
          </div>
        ))}

        <div style={{ marginTop: 8 }}>
          <strong>講師コメント</strong>
          <div>{savedRow?.coach_comment || "—"}</div>
        </div>
      </div>
    </section>
  );
}