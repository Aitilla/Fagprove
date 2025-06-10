"use client";

import { auth } from "./actions";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";
import { useState } from "react";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const router = useRouter();

  async function handleAction(formData: FormData) {
    const result = await auth(formData, mode);

    switch (result.success) {
      case 1:
        router.replace("/ruter");
        break;
      case 2:
        setMode("login");
        console.log("signup successful")
        break;
      case 3:
        prompt(`${mode} failed`);
        break;
    }
  }

  return (
    <div className={styles.main}>
      <div className={`${styles.signing}`}>
        <form action={handleAction}>
          {mode === "signup" && (
            <>
              <label htmlFor="email">Epost</label>
              <input id="email" name="email" type="email" required />
            </>
          )}

          <label htmlFor="username">Brukernavn</label>
          <input id="username" name="username" type="username" required />
          <label htmlFor="password">Passord</label>
          <input id="password" name="password" type="password" required />

          <button type="submit">
            {mode === "login" ? "Log in" : "Lag bruker"}
          </button>

          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
          >
            {mode === "login" ? "Lag bruker" : "Hvis du allerede har bruker log in her"}
          </button>
        </form>
      </div>
    </div>
  );
}
