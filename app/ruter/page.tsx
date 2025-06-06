"use client";

import styles from "./ruter.module.css";
import { useEffect, useState } from "react";
import { useSimpleFetch } from "../components/hooks/useSimpleFetch";
import { setRoute, getUserRoutes, setFavorite } from "./actions";

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

  const [lineNumber, setLineNumber] = useState<string>("");
  const [stationName, setStationName] = useState<string>("");
  const lineRef: string = `RUT:Line:${lineNumber}`;

  let userRoute = NaN;
  let routeID = "";
  let userStation = ""
  let favorite: boolean = false

  useEffect(() => {
    const int = setInterval(refresh, 1000 * 1000);
    // Interval format is miliseconds * seconds * minutes* hours * days
    return () => {
      clearInterval(int);
    };
  }, [refresh]);

  useEffect(() => {
    userData();
    console.log(data);
    console.log(loading);
    console.log(error);
  }, [data, loading, error]);

  async function userData() {
    const response = await getUserRoutes();
    if (!response.success) prompt("Invalid user data");


    userRoute = response.lineRef
    routeID = response.routeID;
    userStation = response.stationName
    favorite = response.favorite

  }

  async function handleAction(formData: FormData) {
    const input = {
      lineNumber: formData.get("lineNumber") as string,
      stationName: formData.get("stationName") as string,
    };
    setLineNumber(input.lineNumber);
    setStationName(input.stationName);

    const spesificBuss = data?.data.filter((x) => x.LineRef.includes(lineRef));
    if (!spesificBuss || spesificBuss.length === 0) {
      prompt(`Buss line ${lineNumber} does not exist`);
      return;
    }

    let station: any | undefined = undefined;

    for (const busses of spesificBuss) {
      if (!Array.isArray(busses.EstimatedCalls)) continue;
      for (const singleBuss of busses.EstimatedCalls) {
        if (!Array.isArray(singleBuss.EstimatedCall)) continue;
        const found = singleBuss.EstimatedCall.find((x) =>
          x.StopPointName.includes(stationName)
        );
        if (found) {
          station = found;
          break;
        }
        if (station) break;
      }
    }

    if (!station) {
      prompt(`Buss station does not exist on line ${input.lineNumber}`);
      return;
    }

    const route = await setRoute(formData);

    if (!route.success) {
      prompt("An error has occured, please try again later");
    } else {
      prompt("Succesfull, buss and station added to user");
    }
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.monitor}>
        <h1>Your monitored busses</h1>
        <div className={styles.bussContainer}>
          <p>
            Buss: {userRoute}
            <br />
            Stopp: {userStation}
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
            required
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
            required
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
