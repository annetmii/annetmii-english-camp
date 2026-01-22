// lib/scene.ts
import type { SupabaseClient } from "@supabase/supabase-js";

const KEY = "ec_scene_n";

/**
 * localStorage から Scene を取得
 */
export function getSceneFromStorage(): number {
  if (typeof window === "undefined") return 1;
  const raw = window.localStorage.getItem(KEY);
  const n = raw ? Number(raw) : 1;
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

/**
 * localStorage に Scene を保存
 */
export function setSceneToStorage(n: number) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, String(n));
}

/**
 * 今取り組むべき Scene を決定する
 *
 * ルール（重要）:
 * 1. DB に提出データが 1件もなければ、必ず Scene 1
 * 2. DB にデータがある場合のみ、
 *    scene_n の round_n (1,2,3) が揃っていれば次の Scene
 * 3. localStorage は「進捗キャッシュ」にすぎず、DBが正
 */
export async function computeCurrentScene(
  supabase: SupabaseClient,
  userId: string
): Promise<number> {
  // === Step 1: DB が空か確認 ===
  const { data: anyRows, error: anyErr } = await supabase
    .from("submissions")
    .select("id")
    .eq("user_id", userId)
    .limit(1);

  if (anyErr) {
    console.log("computeCurrentScene error", anyErr);
    return 1;
  }

  // DBが空 → 強制的に Scene 1
  if (!anyRows || anyRows.length === 0) {
    setSceneToStorage(1);
    return 1;
  }

  // === Step 2: DB がある場合のみ進捗判定 ===
  let scene = getSceneFromStorage();

  // 安全策：最大100 Scene
  for (let i = 0; i < 100; i++) {
    const { data, error } = await supabase
      .from("submissions")
      .select("round_n")
      .eq("user_id", userId)
      .eq("scene_n", scene);

    if (error) {
      console.log("computeCurrentScene error", error);
      return scene;
    }

    const rounds = new Set((data ?? []).map((r: any) => r.round_n));
    const completed =
      rounds.has(1) && rounds.has(2) && rounds.has(3);

    // 未完了 → ここが現在の Scene
    if (!completed) {
      return scene;
    }

    // 完了 → 次へ
    scene += 1;
    setSceneToStorage(scene);
  }

  return scene;
}