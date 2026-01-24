"use client";

import { useMemo, useState } from "react";

type Props = {
  target1: string[];
  target2: string[];
  extra?: string[];
  sentence1RoleJa?: string;
  sentence2RoleJa?: string;
  onSubmit: (payload: {
    answer1: string;
    answer2: string;
    isCorrect: boolean;
    wrongTokens: string[];
  }) => Promise<void> | void;
};

type Token = { id: string; text: string };

function format(tokens: string[]) {
  return tokens.join(" ").replace(/\s([?.!,;:])/g, "$1");
}

function toTokens(list: string[], offset: number) {
  return list.map((text, idx) => ({ id: `${offset + idx}-${text}`, text }));
}

function shuffleTokens<T>(list: T[]) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function calcWrongTokens(picked: string[], target: string[]) {
  const wrong: string[] = [];
  const max = Math.max(picked.length, target.length);
  for (let i = 0; i < max; i++) {
    const p = picked[i];
    const t = target[i];
    if (p !== t) {
      if (p) wrong.push(p);
    }
  }
  return Array.from(new Set(wrong));
}

export default function TapTwoSentenceBuilder({
  target1,
  target2,
  extra = [],
  sentence1RoleJa,
  sentence2RoleJa,
  onSubmit,
}: Props) {
  const pool1 = useMemo(() => {
    const tokens = toTokens([...target1, ...extra], 0);
    return shuffleTokens(tokens);
  }, [target1, extra]);

  const pool2 = useMemo(() => {
    const tokens = toTokens([...target2, ...extra], 10_000);
    return shuffleTokens(tokens);
  }, [target2, extra]);

  const [used1, setUsed1] = useState<Set<string>>(new Set());
  const [used2, setUsed2] = useState<Set<string>>(new Set());

  const [picked1, setPicked1] = useState<Token[]>([]);
  const [picked2, setPicked2] = useState<Token[]>([]);

  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [result, setResult] = useState<"idle" | "correct" | "incorrect">("idle");

  const available1 = pool1.filter((t) => !used1.has(t.id));
  const available2 = pool2.filter((t) => !used2.has(t.id));

  const builtTokens1 = picked1.map((t) => t.text);
  const builtTokens2 = picked2.map((t) => t.text);

  const answer1 = format(builtTokens1);
  const answer2 = format(builtTokens2);

  const targetStr1 = format(target1);
  const targetStr2 = format(target2);

  const isCorrect = answer1 === targetStr1 && answer2 === targetStr2;

  const tapToken1 = (t: Token) => {
    setResult("idle");
    setStatus("idle");
    setUsed1(new Set([...Array.from(used1), t.id]));
    setPicked1([...picked1, t]);
  };

  const tapToken2 = (t: Token) => {
    setResult("idle");
    setStatus("idle");
    setUsed2(new Set([...Array.from(used2), t.id]));
    setPicked2([...picked2, t]);
  };

  const tapPicked1 = (t: Token) => {
    setResult("idle");
    setStatus("idle");
    const next = new Set(used1);
    next.delete(t.id);
    setUsed1(next);
    setPicked1(picked1.filter((x) => x.id !== t.id));
  };

  const tapPicked2 = (t: Token) => {
    setResult("idle");
    setStatus("idle");
    const next = new Set(used2);
    next.delete(t.id);
    setUsed2(next);
    setPicked2(picked2.filter((x) => x.id !== t.id));
  };

  const reset = () => {
    setUsed1(new Set());
    setUsed2(new Set());
    setPicked1([]);
    setPicked2([]);
    setResult("idle");
    setStatus("idle");
  };

  const submit = async () => {
    setResult(isCorrect ? "correct" : "incorrect");
    setStatus("saving");

    const wrong = [
      ...calcWrongTokens(builtTokens1, target1),
      ...calcWrongTokens(builtTokens2, target2),
    ];

    try {
      await onSubmit({
        answer1,
        answer2,
        isCorrect,
        wrongTokens: wrong,
      });
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section style={{ display: "grid", gap: 12 }}>
      <div style={{ fontSize: 13, opacity: 0.8 }}>
        単語チップをタップして、セリフを完成させてください。
      </div>

<div
  style={{
    border: "1px solid rgba(0,0,0,0.15)",
    borderRadius: 14,
    padding: 12,
    paddingBottom: 6, // ← ここを追加
    display: "grid",
    gap: 10,
    boxSizing: "border-box",
    width: "100%",
    maxWidth: "100%",
    overflow: "hidden",
  }}
>
 
        <div style={{ display: "grid", gap: 10 }}>
          <div style={sentenceBox}>
            <div style={sentenceLabel}>
              Sentence 1{sentence1RoleJa ? `｜${sentence1RoleJa}` : ""}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {picked1.length ? (
                picked1.map((t) => (
                  <button key={t.id} onClick={() => tapPicked1(t)} style={chipStyle(true)}>
                    {t.text}
                  </button>
                ))
              ) : (
                <span style={{ opacity: 0.4 }}>ここにセリフが表示されます</span>
              )}
            </div>
          </div>

          <div style={sentenceBox}>
            <div style={sentenceLabel}>
              Sentence 2{sentence2RoleJa ? `｜${sentence2RoleJa}` : ""}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {picked2.length ? (
                picked2.map((t) => (
                  <button key={t.id} onClick={() => tapPicked2(t)} style={chipStyle(true)}>
                    {t.text}
                  </button>
                ))
              ) : (
                <span style={{ opacity: 0.4 }}>ここにセリフが表示されます</span>
              )}
            </div>
          </div>
        </div>

<div style={{ display: "grid", gap: 6 }}>
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
    <button
      onClick={reset}
      className="ec-btn"
      disabled={status === "saving"}
      style={{ width: "100%", textAlign: "center" }}
      type="button"
    >
      Reset
    </button>

    <button
      onClick={submit}
      className="ec-btn"
      disabled={status === "saving"}
      style={{ width: "100%", textAlign: "center" }}
      type="button"
    >
      Submit
    </button>
  </div>

  <div style={{ fontSize: 12, opacity: 0.75, minHeight: 16 }}>
    {status === "saving"
      ? "Saving..."
      : status === "saved"
      ? "Saved"
      : status === "error"
      ? "Save failed"
      : ""}
  </div>
</div>

{result !== "idle" ? (
  <div
    style={{
      padding: 12,
      borderRadius: 12,
      border: "1px solid rgba(0,0,0,0.15)",
      fontWeight: 700,
      fontSize: 18,
      background:
        result === "correct"
          ? "rgba(0, 128, 0, 0.06)"
          : "rgba(255, 0, 0, 0.06)",
    }}
  >
    {result === "correct" ? "Correct" : "Almost"}
  </div>
) : null}
      </div>

      <div style={poolWrap}>
        <div style={{ display: "grid", gap: 8 }}>
          <div style={poolTitle}>セリフ① 用の単語</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {available1.map((t) => (
              <button key={t.id} onClick={() => tapToken1(t)} style={chipStyle(false)}>
                {t.text}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <div style={poolTitle}>セリフ② 用の単語</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {available2.map((t) => (
              <button key={t.id} onClick={() => tapToken2(t)} style={chipStyle(false)}>
                {t.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const btnStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid rgba(0,0,0,0.15)",
  background: "white",
};

const sentenceBox: React.CSSProperties = {
  padding: 10,
  borderRadius: 12,
  border: "1px solid rgba(0,0,0,0.12)",
};

const sentenceLabel: React.CSSProperties = {
  fontSize: 12,
  opacity: 0.7,
  marginBottom: 6,
};

const poolWrap: React.CSSProperties = {
  display: "grid",
  gap: 14,
  borderTop: "1px solid rgba(0,0,0,0.12)",
  paddingTop: 12,
};

const poolTitle: React.CSSProperties = {
  fontSize: 12,
  opacity: 0.7,
};

function chipStyle(selected: boolean): React.CSSProperties {
  return {
    padding: "10px 12px",
    borderRadius: 999,
    border: "1px solid rgba(0,0,0,0.18)",
    background: selected ? "rgba(0,0,0,0.06)" : "white",
  };
}