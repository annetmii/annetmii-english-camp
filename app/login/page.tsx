"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function LoginPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const signIn = async () => {
    setErrorMsg(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: "https://annetmii-english-camp.vercel.app",
      },
    });
    if (error) setErrorMsg(error.message);
    else setSent(true);
  };

  return (
    <main style={{ maxWidth: 520, margin: "40px auto", padding: 16 }}>
      <h1>Sign in</h1>

      {sent ? (
        <p>Check your email and click the login link.</p>
      ) : (
        <>
          <input
            type="email"
            placeholder="you@your-company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: 12, fontSize: 16 }}
          />
          <button
            onClick={signIn}
            style={{ marginTop: 12, padding: 12, width: "100%", fontSize: 16 }}
          >
            Send login link
          </button>
          {errorMsg ? <p style={{ marginTop: 12 }}>{errorMsg}</p> : null}
        </>
      )}
    </main>
  );
}