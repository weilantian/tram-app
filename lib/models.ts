export interface Stop {
  stopName: string;
  stopLandmark: string;
  stopId: number;
  stopLatitude: number;
  stopLongitude: number;
  routes: Array<Route>;
}

export interface Route {
  routeNumber: string;
  routeName: string;
}

export interface Departure {
  disruptionIds: Array<number>;
  atPlatform: boolean;
  stopId: number;
  routeId: number;
  scheduledDepartureUtc: string;
  estimatedDepartureUtc: string;
}
