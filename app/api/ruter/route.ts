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

export async function GET() {
  const data = await fetch(apiUrl)
    .then((res) => res.text())
    .then((res) => parseStringPromise(res) as Promise<DataResponse>)
    .then(
      (res) =>
        res.Siri.ServiceDelivery[0].EstimatedTimetableDelivery[0]
          .EstimatedJourneyVersionFrame[0].EstimatedVehicleJourney
    );
  return Response.json({ data });
}
