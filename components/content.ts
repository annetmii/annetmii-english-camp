export type CharacterId = "manager" | "colleague" | "staff";

export const CHARACTERS: Record<
  CharacterId,
  { name: string; roleJa: string; img: string }
> = {
  manager: {
    name: "Manager",
    roleJa: "上司。報告・提案を求める。",
    img: "/characters/manager.png",
  },
  colleague: {
    name: "Colleague",
    roleJa: "同僚。状況共有と相談の相手。",
    img: "/characters/colleague.png",
  },
  staff: {
    name: "Staff member",
    roleJa: "部下。依頼・調整・協力要請の相手。",
    img: "/characters/staff.png",
  },
};
export type RoundContent = {
  n: 1 | 2 | 3;
  characterId: CharacterId;
  characterLabel: string;
  intentJa: string;
  situationJa: string;
  partnerLineEn: string;
  targetTokens1: string[];
  targetTokens2: string[];
  extraTokens: string[];
};

export type SceneContent = {
  scene: number;
  rounds: RoundContent[];
};

export const SCENES: SceneContent[] = [
  {
    scene: 1,
    rounds: [
      {
        n: 1,
        characterId: "manager",
        characterLabel: "Manager",
        intentJa: "懸念を伝え、代案を提案する",
        situationJa: "上司とのミーティング。週末の人手不足が懸念。対応案を提案したい。",
        partnerLineEn: "What’s the staffing situation this weekend?",
        targetTokens1: ["I’m", "concerned", "about", "the", "weekend", "staffing", "shortage", "."],
        targetTokens2: ["To", "address", "this", ",", "I", "suggest", "adjusting", "shifts", "and", "hiring", "part-time", "staff", "."],
        extraTokens: ["am", "worry", "for", "because", "maybe"],
      },
      {
        n: 2,
        characterId: "colleague",
        characterLabel: "Colleague",
        intentJa: "懸念を伝え、代案を提案する",
        situationJa: "同僚に状況共有。週末のシフトが厳しい。代案を一緒に考えたい。",
        partnerLineEn: "Can we cover the weekend shifts?",
        targetTokens1: ["I’m", "concerned", "about", "coverage", "this", "weekend", "."],
        targetTokens2: ["To", "address", "this", ",", "I", "suggest", "swapping", "shifts", "and", "asking", "for", "support", "."],
        extraTokens: ["covered", "supporting", "please", "so"],
      },
      {
        n: 3,
        characterId: "staff",
        characterLabel: "Staff member",
        intentJa: "懸念を伝え、代案を提案する",
        situationJa: "部下に相談。週末の人手不足の懸念を伝え、シフト調整の協力を依頼したい。",
        partnerLineEn: "Do you need me to adjust my shift?",
        targetTokens1: ["I’m", "concerned", "about", "our", "staffing", "this", "weekend", "."],
        targetTokens2: ["To", "address", "this", ",", "I", "suggest", "adjusting", "the", "schedule", "and", "confirming", "availability", "."],
        extraTokens: ["urgent", "maybe", "thanks"],
      },
    ],
  },

  // Scene2はここに追加していく
  {
    scene: 2,
    rounds: [
      // TODO: Round1〜3 をここに追加
      // Scene1をコピペして文面を差し替えるのが最速
      // （このブロックを3つ並べる）
      {
        n: 1,
        characterId: "manager",
        characterLabel: "Manager",
        intentJa: "（Scene2 Round1の意図）",
        situationJa: "（Scene2 Round1の状況）",
        partnerLineEn: "（相手の一言）",
        targetTokens1: ["(tokens)"],
        targetTokens2: ["(tokens)"],
        extraTokens: [],
      },
      {
        n: 2,
        characterId: "colleague",
        characterLabel: "Colleague",
        intentJa: "（Scene2 Round2の意図）",
        situationJa: "（Scene2 Round2の状況）",
        partnerLineEn: "（相手の一言）",
        targetTokens1: ["(tokens)"],
        targetTokens2: ["(tokens)"],
        extraTokens: [],
      },
      {
        n: 3,
        characterId: "staff",
        characterLabel: "Staff member",
        intentJa: "（Scene2 Round3の意図）",
        situationJa: "（Scene2 Round3の状況）",
        partnerLineEn: "（相手の一言）",
        targetTokens1: ["(tokens)"],
        targetTokens2: ["(tokens)"],
        extraTokens: [],
      },
    ],
  },
];

export function getRound(scene: number, n: number) {
  const s = SCENES.find((x) => x.scene === scene);
  if (!s) return null;
  return s.rounds.find((r) => r.n === n) ?? null;
}