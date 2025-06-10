"use client";

import styles from "./ruter.module.css";
import { useEffect, useState } from "react";
import { useSimpleFetch } from "../components/hooks/useSimpleFetch";
import { setRoute, getUserRoutes, toggleFavorite } from "./actions";

type UserRoute = {
  route_id: string;
  line_ref: number;
  monitored_station: string;
  favorite: boolean;
};

type EstimatedCall = {
  DestinationDisplay: string[];
  StopPointName: string[];
  AimedDepartureTime: string[];
  AimedArrivalTime: string[];
};

export default function RuterPage() {
  const { data, loading, error, refresh } = useSimpleFetch<{
    data: {
      LineRef: string[];
      DirectionRef: string[];
      EstimatedCalls: {
        EstimatedCall: {
          DestinationDisplay: string[];
          StopPointName: string[];
          AimedDepartureTime: string[];
          AimedArrivalTime: string[];
        }[];
      }[];
    }[];
  }>("/api/ruter");

  const [userRoutes, setUserRoutes] = useState<UserRoute[]>([]);

  useEffect(() => {
    const int = setInterval(refresh, 1000 * 41); // 41 seconds
    // Interval format is miliseconds * seconds * minutes* hours * days
    return () => {
      clearInterval(int);
    };
  }, [refresh]);

  useEffect(() => {
    userData();
    console.log(loading);
    console.log(error);
    async function userData() {
      const response = await getUserRoutes();
      if (!response.success) prompt("Invalid user data");

      setUserRoutes(response.userRoutes);
    }
  }, [data, loading, error]);

  async function handleAction(formData: FormData) {
    const input = {
      lineNumber: formData.get("lineNumber") as string,
      stationName: formData.get("stationName") as string,
    };
    const spesificBuss = data?.data.filter((x) =>
      x.LineRef.includes(`RUT:Line:${input.lineNumber}`)
    );

    if (!spesificBuss || spesificBuss.length === 0) {
      prompt(`Buss line ${input.lineNumber} does not exist`);
      return;
    }

    let station: EstimatedCall | undefined = undefined;

    for (const busses of spesificBuss) {
      if (!Array.isArray(busses.EstimatedCalls)) continue;
      for (const singleBuss of busses.EstimatedCalls) {
        if (!Array.isArray(singleBuss.EstimatedCall)) continue;
        const found = singleBuss.EstimatedCall.find((x) =>
          x.StopPointName.includes(input.stationName)
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

  const handleFavoriteToggle = (route: UserRoute) => {
    toggleFavorite(route.route_id, !route.favorite);
    setUserRoutes((prev) =>
      prev.map((r) =>
        r.route_id === route.route_id ? { ...r, favorite: !r.favorite } : r
      )
    );
  };

  const favorites = userRoutes.filter((route) => route.favorite);
  const others = userRoutes.filter((route) => !route.favorite);

  const visualizeBus = (line: number, station: string) => {
    const spesificBuss = data?.data.filter((x) =>
      x.LineRef.includes(`RUT:Line:${line}`)
    );

    if (!spesificBuss || spesificBuss.length === 0) {
      return <span>No busses driving now, it might be too late/early</span>;
    }

    const busInfo: { time: string; direction: string }[] = [];

    for (const busses of spesificBuss) {
      if (!Array.isArray(busses.EstimatedCalls)) continue;

      for (const singleBuss of busses.EstimatedCalls) {
        if (!Array.isArray(singleBuss.EstimatedCall)) continue;

        for (const call of singleBuss.EstimatedCall) {
          if (!call.StopPointName.includes(station)) continue;

          const aimedTime = call.AimedDepartureTime?.[0];
          const destination = call.DestinationDisplay?.[0];

          if (aimedTime && destination) {
            const timeBuffer = new Date(
              new Date(aimedTime).getTime() - 1000 * 60 * 3
            )
              .toTimeString()
              .slice(0, 5);

            busInfo.push({
              time: timeBuffer,
              direction: destination,
            });
          }

          if (busInfo.length >= 2) break;
        }

        if (busInfo.length >= 2) break;
      }

      if (busInfo.length >= 2) break;
    }

    return (
      <>
        {busInfo.map((bus, i) => (
          <span key={i}>
            {i + 1}. Neste buss går {bus.time} retning {bus.direction}
            <br />
          </span>
        ))}
      </>
    );
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.inputContainer}>
        <form action={handleAction}>
          <label htmlFor="lineNumber">Velg ønsket buss</label>
          <input type="number" placeholder="Søk" name="lineNumber" required />
          <label htmlFor="stationName">Velg ønsket stasjon</label>
          <input type="text" placeholder="Search" name="stationName" required />
          <button type="submit">Legg til bussrute</button>
        </form>
      </div>

      <div className={styles.busesContainer}>
        <div className={styles.favoriteBuses}>
          <h2>Favoritter</h2>
          {favorites.map((route) => (
            <div key={route.route_id} className={styles.eachBus}>
              <span>Linje: {route.line_ref}</span>
              <br />
              <span>Holdeplass: {route.monitored_station}</span>
              <br />
              {visualizeBus(route.line_ref, route.monitored_station)}
              <button
                onClick={() => handleFavoriteToggle(route)}
                className={styles.favoriteBtn}
              >
                Fjern favoritt
              </button>
            </div>
          ))}
        </div>

        <div className={styles.otherBuses}>
          <h2>Andre busser</h2>
          {others.map((route) => (
            <div key={route.route_id} className={styles.eachBus}>
              <span>Linje: {route.line_ref}</span>
              <br />
              <span>Holdeplass: {route.monitored_station}</span>
              <br />
              <span>
                {visualizeBus(route.line_ref, route.monitored_station)}
              </span>
              <button
                onClick={() => handleFavoriteToggle(route)}
                className={styles.favoriteBtn}
              >
                Legg til som favoritt
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
