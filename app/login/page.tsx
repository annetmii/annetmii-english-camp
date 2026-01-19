"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function LoginPage() {
  const router = useRouter();
  const supabase = useMemo(() => supabaseBrowser(), []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const onSignIn = async () => {
    setBusy(true);
    setMsg(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setBusy(false);

    if (error) {
      setMsg(error.message);
      return;
    }

    router.replace("/home");
  };

  return (
    <main className="ec-wrap">
      <header className="ec-topbar">
        <Link href="/" className="ec-pill">
          Back
        </Link>
        <div />
      </header>

      <section className="ec-card">
        <div style={{ display: "grid", gap: 12 }}>
          <label className="ec-label">
            Email
            <input
              className="ec-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="info@annetmii.com"
              autoCapitalize="none"
              autoCorrect="off"
            />
          </label>

          <label className="ec-label">
            Password
            <input
              className="ec-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              type="password"
            />
          </label>

          <div style={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
            <button className="ec-btn" onClick={onSignIn} disabled={busy} style={{ minWidth: 200 }}>
              Sign in
            </button>
          </div>

          {msg && <div className="ec-error">{msg}</div>}
        </div>
      </section>
    </main>
  );
}