import { parseStringPromise } from "xml2js";

// et in URL is estimated time
// sx is situational exchange
const apiUrl = "https://api.entur.io/realtime/v1/rest/et?datasetId=RUT";

export const dynamic = "force-static";

type DataResponse = {
  Siri: {
    ServiceDelivery: [
      {
        EstimatedTimetableDelivery: [
          {
            EstimatedJourneyVersionFrame: [
              { EstimatedVehicleJourney: unknown[] }
            ];
          }
        ];
      }
    ];
  };
};

let storedData: unknown[] = []
const countdown: number = 1000 * 40; // 40 seconds

storeData(countdown);

function storeData(countdown: number) {
  const fetchAndStore = () => {
    fetch(apiUrl)
      .then((res) => res.text())
      .then((res) => parseStringPromise(res) as Promise<DataResponse>)
      .then(
        (res) =>
          res.Siri.ServiceDelivery[0].EstimatedTimetableDelivery[0]
            .EstimatedJourneyVersionFrame[0].EstimatedVehicleJourney
      )
      .then((res) => (storedData = res));
  };

  fetchAndStore();
  setInterval(fetchAndStore, countdown);
}

export async function GET() {
  return Response.json({ data: storedData });
}