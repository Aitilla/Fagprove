"use client";

import styles from "./ruter.module.css";
import { useEffect, useState } from "react";
import { useSimpleFetch } from "../components/hooks/useSimpleFetch";
import { setOption, getUserRoutes } from "./actions";

export default function RuterPage() {
  const { data, loading, error, refresh } = useSimpleFetch<{
    data: {
      LineRef: string[];
      EstimatedCalls: {
        EstimatedCall: {
          DestinationDisplay: string[];
          StopPointName: string[];
          AimedDepartureTime: string[];
          AimedArrivalTime: string[];
        }[];
      }[];
      RecordedCalls: {
        RecordedCall: {
          StopPointName: string[];
          AimedDepartureTime: string[];
          AimedArrivalTime: string[];
        }[];
      }[];
    }[];
  }>("/api/ruter");

  const [lineNumber, setLineNumber] = useState<number>(58);
  const [station, setStation] = useState<string>("Krokstien");
  const [direction, setDirection] = useState<string>("Tveita T");
  const lineRef: string = `RUT:Line:${lineNumber}`;
  const username: string = "testBruker";

  async function handleAction(formData: FormData) {
    const response = await setOption(formData, username);
    if (!response.success) {
      prompt("Invalid input on either buss or station");
    } else {
      prompt("Succesfull, buss and station added to user");
    }
  }

  async function getRoutes() {
    const routes = await getUserRoutes(username);
    if (!routes.success) {
      console.log("something went wrong");
    }
  }
  getRoutes();

  //   async function getUserSetting(username: string) {
  //     const result = await getUser(username);
  //     if (!result.success) {
  //       prompt("Please try again later");
  //     } else {
  //       setLineNumber(result.lineRef);
  //       setStation(result.station);
  //       setDirection(result.direction);
  //     }
  //   }

  useEffect(() => {
    const int = setInterval(refresh, 1000 * 1000);
    // Interval format is miliseconds * seconds * minutes* hours * days
    return () => {
      clearInterval(int);
    };
  }, []);

  useEffect(() => {
    const bussLines = data?.data.map((x) => x.LineRef[0]).sort();
    const spesificBuss = data?.data.filter((x) => x.LineRef.includes(lineRef));
    const destination =
      spesificBuss?.[0].EstimatedCalls?.[0].EstimatedCall[1]
        .DestinationDisplay[0];
    console.log(spesificBuss);
    console.log(destination);
    console.log(loading);
    console.log(error);
  }, [data, loading, error]);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.monitor}>
        <h1>Your monitored busses</h1>
        <div className={styles.bussContainer}>
          <p>
            Buss: {lineNumber}
            <br />
            Retning: {direction}
            <br />
            Stopp: {station}
          </p>
          <p>Neste buss ankommer: </p>
        </div>
      </div>
      <div className={styles.inputContainer}>
        <form action={handleAction}>
          <label htmlFor="lineNumber">Choose a bussline</label>
          <input
            type="number"
            placeholder="Search"
            name="lineNumber"
            list="bussLine"
          />
          <datalist id="bussLine">
            <option value="69">69 Lutvann via hellerudtoppen</option>
            {/* Map all LineRef to create options */}
          </datalist>
          <label htmlFor="stationName">Choose monitored station</label>
          <input
            type="text"
            placeholder="Search"
            name="stationName"
            list="station"
          />
          <datalist id="station">
            <option value="Krokstien">Krokstien</option>
            {/* Map all stations from lineRef */}
          </datalist>

          <button type="submit">Add buss and station to list</button>
        </form>
      </div>
    </div>
  );
}
