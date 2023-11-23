import axios from "axios";
import crypto from "crypto";
import { Departure, Direction, Disruption, Route, Stop } from "./models";
import { number, z } from "zod";

const baseUrl = "https://timetableapi.ptv.vic.gov.au";

const request = async (
  url: string,
  params: Record<any, any>,
  revalidate?: number,
  tags?: Array<string>
) => {
  const devId = process.env.DEV_ID;
  const apiKey = process.env.API_KEY;
  if (!devId || !apiKey) {
    throw new Error("DEV_ID or API_KEY not set");
  }
  // Url with params is a string like this: `?param1=value1&param2=value2` from the params object
  let urlWithParams = Object.entries(params).length
    ? `${url}?${Object.entries(params)
        .map(([key, value]) => `${key}=${String(value)}`)
        .join("&")}`
    : url;

  urlWithParams = urlWithParams.includes("?")
    ? `${urlWithParams}&devid=${devId}`
    : `${urlWithParams}?devid=${devId}`;

  const hashed = crypto.createHmac("sha1", apiKey);
  hashed.update(urlWithParams);

  const signature = hashed.digest("hex");

  urlWithParams = `${urlWithParams}&signature=${signature}`;

  const res = await fetch(`${baseUrl}${urlWithParams}`, {
    headers: {
      Accept: "application/json",
    },
    next: {
      revalidate,
      tags,
    },
  });

  return res.json();
};

export const getRoutes = async () => {
  try {
    const response = await request("/v3/routes", {});
    return response.routes;
  } catch (error) {
    console.log(error);
  }
};

export const getStopDetail = async (stopId: number, routeType: number = 1) => {
  try {
    const response = await request(
      `/v3/stops/${stopId}/route_type/${routeType}`,
      { expand: "Disruptions" },
      10
    );

    const schema = z.object({
      stop_name: z.string(),
      stop_id: z.number(),
      routes: z.array(
        z.object({
          route_number: z.string(),
          route_name: z.string(),
        })
      ),
      stop_landmark: z.string(),
    });

    const data = schema.parse(response.stop);
    return {
      stopName: data.stop_name,
      stopId: data.stop_id,
      routes: data.routes.map((route) => ({
        routeNumber: route.route_number,
        routeName: route.route_name,
      })),
      stopLandmark: data.stop_landmark,
    } as Stop;
  } catch (error) {
    console.log(error);
  }
};

export const getDepartures = async (
  stopId: number,
  routeType: number = 1
): Promise<
  | {
      disruptions: Array<Disruption>;
      departures: Array<Departure>;
      routes: Array<Route>;
      directions: Array<Direction>;
    }
  | undefined
> => {
  try {
    const response = await request(
      `/v3/departures/route_type/${routeType}/stop/${stopId}`,
      {
        max_results: 5,
        include_cancelled: false,
        expand: ["All"],
      }
    );

    const schema = z.object({
      directions: z.record(
        z.string(),
        z.object({
          route_id: z.number(),
          direction_id: z.number(),
          direction_name: z.string(),
        })
      ),
      disruptions: z.record(
        z.string(),
        z.object({
          title: z.string(),
          url: z.string(),
          description: z.string(),
          disruption_status: z.string(),
          disruption_type: z.string(),
          colour: z.string(),
        })
      ),
      departures: z.array(
        z.object({
          direction_id: z.number(),
          at_platform: z.boolean(),
          stop_id: z.number(),
          route_id: z.number(),
          disruption_ids: z.array(z.number()),
          scheduled_departure_utc: z.string().transform((val) => new Date(val)),
          estimated_departure_utc: z
            .string()
            .transform((val) => new Date(val))
            .nullable(),
        })
      ),
      routes: z.record(
        z.string(),
        z.object({
          route_id: z.number(),
          route_number: z.string(),
          route_name: z.string(),
        })
      ),
    });

    const data = schema.parse(response);

    return {
      directions: Object.entries(data.directions).map(([key, value]) => ({
        directionId: value.direction_id,
        directionName: value.direction_name,
        routeId: value.route_id,
      })),
      disruptions: Object.entries(data.disruptions).map(([key, value]) => ({
        id: Number(key),
        title: value.title,
        url: value.url,
        description: value.description,
        disruptionStatus: value.disruption_status,
        disruptionType: value.disruption_type,
        colour: value.colour,
      })),
      departures: data.departures.map((departure) => ({
        directionId: departure.direction_id,
        stopId: departure.stop_id,
        disruptionIds: departure.disruption_ids,
        atPlatform: departure.at_platform,
        routeId: departure.route_id,
        scheduledDeparture: departure.scheduled_departure_utc,
        estimatedDeparture: departure.estimated_departure_utc,
      })),
      routes: Object.entries(data.routes).map(([key, value]) => ({
        routeId: value.route_id,
        routeNumber: value.route_number,
        routeName: value.route_name,
      })),
    };
  } catch (error) {
    console.log(error);
  }
};

export const searchStops = async (searchTerm: string) => {
  const response = await request(
    `/v3/search/${searchTerm}`,
    {
      route_types: [1],
    },
    undefined,
    ["search", searchTerm]
  );
  const schema = z.object({
    stops: z.array(
      z.object({
        stop_name: z.string(),
        stop_id: z.number(),
        stop_latitude: z.number(),
        stop_longitude: z.number(),
        stop_landmark: z.string(),
      })
    ),
  });

  const data = schema.parse(response);

  return data.stops.map((stop) => ({
    stopName: stop.stop_name,
    stopId: stop.stop_id,
    stopLatitude: stop.stop_latitude,
    stopLongitude: stop.stop_longitude,
    stopLandmark: stop.stop_landmark,
  }));
};
