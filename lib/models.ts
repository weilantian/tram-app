export interface Stop {
  stopName: string;
  stopLandmark: string;
  stopId: number;
  stopLatitude: number;
  stopLongitude: number;
  routes: Array<Route>;
}

export interface Route {
  routeId: number;
  routeNumber: string;
  routeName: string;
}

export interface Departure {
  directionId: number;
  disruptionIds: Array<number>;
  atPlatform: boolean;
  stopId: number;
  routeId: number;
  scheduledDeparture: Date;
  estimatedDeparture: Date | null;
}

export interface Disruption {
  id: number;
  title: string;
  url: string;
  description: string;
  disruptionStatus: string;
  disruptionType: string;
  colour: string;
}

export interface Direction {
  routeId: number;
  directionId: number;
  directionName: string;
}
