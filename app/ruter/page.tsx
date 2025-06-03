"use client";

import styles from "./ruter.module.css";
import { useEffect } from "react";
import { useSimpleFetch } from "../components/hooks/useSimpleFetch";

export default function RuterPage() {
  const { data, loading, error, refresh } = useSimpleFetch<{
    data: { LineRef: string[] }[];
  }>("/api/ruter");

  useEffect(() => {
    const int = setInterval(refresh, 1000 * 1000);
    return () => {
      clearInterval(int);
    };
  }, []);

  useEffect(() => {
    console.log(data?.data.filter((x) => x.LineRef.includes("RUT:Line:69")));
    console.log(loading);
    console.log(error);
  }, [data, loading, error]);
  return (
    <div className={styles.filtering}>
      <label htmlFor="LineRef">Choose a bussline</label>
      <input type="text" placeholder="Search" id="LineRef" list="bussLine" />
      <datalist id="bussLine">
        <option value="69">69 Lutvann via hellerudtoppen</option>{" "}
        {/* Map all LineRef to create options */}
      </datalist>
      <div className={styles.pinned}></div>
    </div>
  );
}
