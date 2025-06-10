"use client";

import { logout } from "./actions";
import { useRouter } from "next/navigation";
import styles from "./header.module.css";

export default function Header() {
  const router = useRouter();

  async function handleLogout() {
    const response = await logout();
    if (!response) {
      prompt("Unexpected error, please try again later");
    }
    router.replace("/ruter");
  }

  return (
    <div className={styles.header}>
      <span></span>
      <h2>Fagprøve</h2>
      <button
        onClick={() => {
          handleLogout();
        }}
      >
        Logout
      </button>
    </div>
  );
}