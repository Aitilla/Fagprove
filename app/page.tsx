"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleAction = () => {
    router.replace("/ruter");
  };
  return (
    <div>
      <button onClick={() => handleAction()}>
        Trykk er for å se fagprøven
      </button>
    </div>
  );
}