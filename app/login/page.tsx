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
    console.log(result.success);

    switch (result.success) {
      case 1:
        router.replace("/");
        break;
      case 2:
        setMode("login");
        console.log("signup successful")
        console.log(mode)
        break;
      case 3:
        prompt(`${mode} failed`);
        console.log(`${mode} failed`);
        break;
    }
  }

  return (
    <div className={styles.main}>
      <div className={`${styles.signing}`}>
        <form action={handleAction}>
          {mode === "signup" && (
            <>
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required />
            </>
          )}

          <label htmlFor="username">Username</label>
          <input id="username" name="username" type="username" required />
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required />

          <button type="submit">
            {mode === "login" ? "Log In" : "Sign Up"}
          </button>

          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
          >
            Switch to {mode === "login" ? "Sign Up" : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}
