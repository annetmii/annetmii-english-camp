// lib/scene.ts
import type { SupabaseClient } from "@supabase/supabase-js";

const KEY = "ec_scene_n";

export function getSceneFromStorage(): number {
  if (typeof window === "undefined") return 1;
  const raw = window.localStorage.getItem(KEY);
  const n = raw ? Number(raw) : 1;
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

export function setSceneToStorage(n: number) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, String(n));
}

// DBを見て、今取り組むべきScene番号を返す
// ルール：scene_n の round_n 1..3 が全て存在したら次の scene に進む
export async function computeCurrentScene(supabase: SupabaseClient, userId: string): Promise<number> {
  // まずはローカルを基準にする（初回は1）
  let scene = getSceneFromStorage();

  // 안전策：最大100シーンまで（無限ループ防止）
  for (let i = 0; i < 100; i++) {
    const { data, error } = await supabase
      .from("submissions")
      .select("round_n")
      .eq("user_id", userId)
      .eq("scene_n", scene);

    if (error) {
      console.log("computeCurrentScene error", error);
      return scene; // DBが読めない時は現状維持
    }

    const rounds = new Set((data ?? []).map((r: any) => r.round_n));
    const completed = rounds.has(1) && rounds.has(2) && rounds.has(3);

    if (!completed) {
      return scene;
    }

    // 全round提出済みなら次へ
    scene += 1;
    setSceneToStorage(scene);
  }

  return scene;
}