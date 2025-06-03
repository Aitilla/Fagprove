"use client";

import styles from "./ruter.module.css";
import { useEffect } from "react";
import { useSimpleFetch } from "../components/hooks/useSimpleFetch";

export default function RuterPage() {
  const { data, loading, error, refresh } = useSimpleFetch<{data: {LineRef: string[]}[]}>("/api/ruter");

  useEffect(() => {
    const int = setInterval(refresh, 1000 * 1000);
    return () => {
      clearInterval(int);
    };
  }, []);

  useEffect(() => { 
    const bussLines = data?.data.map((x) => x.LineRef[0])
    console.log(bussLines)
    const sortedBussLines = bussLines?.map((x) => {})
    console.log(loading);
    console.log(error);
  }, [data, loading, error]);
  return (
    <div className={styles.filtering}>
      <div className="lineRefContainer">
        <label htmlFor="LineRef">Choose a bussline</label>
        <input type="text" placeholder="Search" id="LineRef" list="bussLine" />
        <datalist id="bussLine">
          <option value="69">69 Lutvann via hellerudtoppen</option>{" "}
          {/* Map all LineRef to create options */}
        </datalist>
      </div>
      <div className="stationContainer">
        <label htmlFor="station">Choose monitored station</label>
        <input type="text" placeholder="Search" id="station" list="station" />
        <datalist id="station">
          <option value="Krokstien">Krokstien</option>
          {/* Map all stations from lineRef */}
        </datalist>
      </div>
      <button>Add buss and station to list</button>
      <div className={styles.pinned}></div>
    </div>
  );
}
