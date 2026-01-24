// components/content.ts

export type CharacterId = "manager" | "colleague" | "staff";

export const CHARACTERS: Record<CharacterId, { name: string; roleJa: string; img: string }> = {
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
  n: number;
  titleJa: string;

  // UIラベルは「型」で出す想定
  patternLabelJa: string;

  // 英語の骨格（答えではなく型）
  patternEnLines: string[]; // 例: ["I'm concerned about ...", "To address this, I suggest ..."]

  // 日本語（答えの翻訳ではなく、意図）
  goalJaLines: string[]; // 例: ["懸念を短く伝える", "対応案を提案する"]

  // Sentence 1 / 2 の役割ラベル（Scene固定・Round共通）
  sentence1RoleJa: string;
  sentence2RoleJa: string;

  // もし将来、Sceneの説明文を入れたくなった時用
  descriptionJa?: string;
};

// Scene 1 の定義（今ある固定ヒントをSceneへ移動）
export const SCENES: SceneContent[] = [
  {
    n: 1,
    titleJa: "懸念を伝え、代案を提案する",
    patternLabelJa: "型",
    patternEnLines: ["I'm concerned about ...", "To address this, I suggest ..."],
    goalJaLines: ["懸念を端的に伝える（何が問題かを明確にする）", "対応策を提案する（次に何をするかを示す）"],
    sentence1RoleJa: "懸念を伝える",
    sentence2RoleJa: "対応策を提案する",
    descriptionJa:
      "実際の職場を想定したリアルなシーンで、上司・同僚・部下とのやり取りを通して、英語の「伝わる構造」を身につけます。",
  },

  {
    n: 2,
    titleJa: "依頼し、希望を伝える",
    patternLabelJa: "今回使うチャンク",
    patternEnLines: ["Could you …?", "If possible, I’d like to …"],
    goalJaLines: ["相手に具体的に依頼する", "希望する進め方を丁寧に伝える"],
    sentence1RoleJa: "依頼する",
    sentence2RoleJa: "希望を伝える",
    descriptionJa:
      "依頼→希望の2文で、相手が動きやすい伝え方（何をしてほしいか／理想は何か）を練習します。",
  },
  {
    n: 3,
    titleJa: "確認し、次のアクションを依頼する",
    patternLabelJa: "今回使うチャンク",
    patternEnLines: ["Just to confirm, …", "Would it be possible to …?"],
    goalJaLines: ["事実・認識を確認する", "次のアクションを丁寧に依頼する"],
    sentence1RoleJa: "確認する",
    sentence2RoleJa: "次のアクションを依頼する",
    descriptionJa:
      "確認→依頼の2文で、ミスや手戻りを防ぐコミュニケーションを練習します。",
  },
];

// RoundはScene配下に置く
export const SCENE_ROUNDS: Record<number, RoundContent[]> = {
  1: [
    {
      n: 1,
      characterId: "manager",
      characterLabel: "Manager (HQ)",
      intentJa: "懸念を伝え、代案を提案する",
      situationJa: "HQの上司とのミーティング。週末の人手不足が懸念。対応案を提案したい。",
      partnerLineEn: "What’s the staffing situation this weekend?",
      targetTokens1: ["I’m", "concerned", "about", "the", "weekend", "staffing", "shortage", "."],
      targetTokens2: [
        "To",
        "address",
        "this",
        ",",
        "I",
        "suggest",
        "adjusting",
        "shifts",
        "and",
        "hiring",
        "part-time",
        "staff",
        ".",
      ],
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
      targetTokens2: [
        "To",
        "address",
        "this",
        ",",
        "I",
        "suggest",
        "adjusting",
        "the",
        "schedule",
        "and",
        "confirming",
        "availability",
        ".",
      ],
      extraTokens: ["urgent", "maybe", "thanks"],
    },
  ],

  2: [
    {
      n: 1,
      characterId: "manager",
      characterLabel: "Manager (HQ)",
      intentJa: "依頼し、希望を伝える",
      situationJa: "HQの上司に、週末の人手不足対応のための追加予算承認を依頼したい。",
      partnerLineEn: "Do you need anything from HQ to move forward?",
      targetTokens1: ["Could", "you", "approve", "the", "budget", "for", "part-time", "hiring", "?"],
      targetTokens2: [
        "If",
        "possible",
        ",",
        "I’d",
        "like",
        "to",
        "start",
        "interviews",
        "next",
        "week",
        ".",
      ],
      extraTokens: ["please", "confirm", "maybe", "budgeted", "start", "starting"],
    },
    {
      n: 2,
      characterId: "colleague",
      characterLabel: "Colleague",
      intentJa: "依頼し、希望を伝える",
      situationJa: "同僚に週末シフトの入れ替えをお願いし、可能なら早めに確定したい。",
      partnerLineEn: "Can you handle the weekend coverage?",
      targetTokens1: ["Could", "you", "swap", "shifts", "with", "me", "this", "weekend", "?"],
      targetTokens2: [
        "If",
        "possible",
        ",",
        "I’d",
        "like",
        "to",
        "confirm",
        "the",
        "schedule",
        "today",
        ".",
      ],
      extraTokens: ["maybe", "please", "kindly", "confirming", "swap", "switch"],
    },
    {
      n: 3,
      characterId: "staff",
      characterLabel: "Staff member",
      intentJa: "依頼し、希望を伝える",
      situationJa: "スタッフに空き時間の共有を依頼し、可能なら週末の追加シフトをお願いしたい。",
      partnerLineEn: "Is there anything I can do to help?",
      targetTokens1: ["Could", "you", "share", "your", "availability", "for", "this", "weekend", "?"],
      targetTokens2: [
        "If",
        "possible",
        ",",
        "I’d",
        "like",
        "to",
        "add",
        "one",
        "extra",
        "shift",
        ".",
      ],
      extraTokens: ["maybe", "please", "availability", "available", "add", "adding"],
    },
  ],
  3: [
    {
      n: 1,
      characterId: "manager",
      characterLabel: "Manager (HQ)",
      intentJa: "確認し、次のアクションを依頼する",
      situationJa: "HQミーティングの認識を確認し、事前に資料レビューを依頼したい。",
      partnerLineEn: "Can you send the update before our meeting?",
      targetTokens1: ["Just", "to", "confirm", ",", "our", "meeting", "is", "at", "3", "PM", "JST", "."],
      targetTokens2: [
        "Would",
        "it",
        "be",
        "possible",
        "to",
        "review",
        "the",
        "report",
        "today",
        "?",
      ],
      extraTokens: ["confirming", "review", "reviewed", "maybe", "please", "possible"],
    },
    {
      n: 2,
      characterId: "colleague",
      characterLabel: "Colleague",
      intentJa: "確認し、次のアクションを依頼する",
      situationJa: "同僚と在庫数の認識を確認し、数値の共有を依頼したい。",
      partnerLineEn: "Do we have enough stock for the weekend?",
      targetTokens1: ["Just", "to", "confirm", ",", "we", "have", "enough", "stock", "for", "the", "weekend", "."],
      targetTokens2: [
        "Would",
        "it",
        "be",
        "possible",
        "to",
        "share",
        "the",
        "latest",
        "numbers",
        "?",
      ],
      extraTokens: ["confirm", "confirming", "number", "numbers", "maybe", "please"],
    },
    {
      n: 3,
      characterId: "staff",
      characterLabel: "Staff member",
      intentJa: "確認し、次のアクションを依頼する",
      situationJa: "スタッフのトレーニング参加を確認し、参加可否の返信を依頼したい。",
      partnerLineEn: "Are you joining the training session?",
      targetTokens1: ["Just", "to", "confirm", ",", "the", "training", "starts", "at", "10", "AM", "."],
      targetTokens2: [
        "Would",
        "it",
        "be",
        "possible",
        "to",
        "reply",
        "by",
        "tomorrow",
        "?",
      ],
      extraTokens: ["confirm", "confirming", "maybe", "please", "replying", "tomorrow"],
    },
  ],
};

export function getScene(sceneN: number): SceneContent | null {
  const s = SCENES.find((x) => x.n === sceneN) ?? null;
  return s;
}

export function getSceneRoles(sceneN: number): { s1: string; s2: string } {
  const s = getScene(sceneN);
  return {
    s1: s?.sentence1RoleJa ?? "",
    s2: s?.sentence2RoleJa ?? "",
  };
}

export function getRound(sceneN: number, roundN: number): RoundContent | null {
  const rounds = SCENE_ROUNDS[sceneN] ?? null;
  if (!rounds) return null;
  const r = rounds.find((x) => x.n === roundN) ?? null;
  return r;
}

// Scene ごとに共通で使うチャンク（Round1–3共通）
export const SCENE_CHUNKS: Record<
  number,
  {
    title: string;
    lines: string[];
  }
> = {
  1: {
    title: "今回使うチャンク",
    lines: ["I’m concerned about …", "To address this, I suggest …"],
  },
  2: {
    title: "今回使うチャンク",
    lines: ["Could you …?", "If possible, I’d like to …"],
  },
  3: {
    title: "今回使うチャンク",
    lines: ["Just to confirm, …", "Would it be possible to …?"],
  },
};