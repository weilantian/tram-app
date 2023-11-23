"use client";

import { Departure, Direction, Route } from "@/lib/models";
import { Card, CardContent, Typography, Box, Stack, Chip } from "@mui/material";
import { FC, useCallback, useEffect, useState } from "react";
import { format, formatDistance } from "date-fns";

const RouteItem: FC<{ route: Route; departures: Array<Departure> }> = ({
  route,
  departures,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const computerateLatestDeparture = useCallback(() => {
    return departures
      .filter(
        (departure) =>
          (departure.estimatedDeparture?.getTime() ??
            departure.scheduledDeparture.getTime()) > new Date().getTime()
      )
      .sort(
        (a, b) =>
          new Date(a.estimatedDeparture ?? a.scheduledDeparture).getTime() -
          new Date(b.estimatedDeparture ?? b.scheduledDeparture).getTime()
      )[0];
  }, [departures]);

  const [latestDeparture, setLatestDeparture] = useState<Departure | undefined>(
    computerateLatestDeparture()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setLatestDeparture(computerateLatestDeparture());
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [setLatestDeparture, computerateLatestDeparture]);

  return (
    <Card>
      <CardContent>
        <Stack direction="row" justifyContent="space-between">
          <Stack spacing={2} direction="row">
            <Box>
              <Chip color="primary" label={route.routeNumber} />
            </Box>
            <Box>
              <Typography fontWeight={500}>{route.routeName}</Typography>

              <Typography>
                {format(
                  latestDeparture?.estimatedDeparture ??
                    latestDeparture?.scheduledDeparture!,
                  "HH:mm"
                )}
              </Typography>
            </Box>
          </Stack>
          {(latestDeparture?.estimatedDeparture ||
            latestDeparture?.scheduledDeparture) && (
            <Chip
              label={formatDistance(
                latestDeparture?.estimatedDeparture ??
                  latestDeparture?.scheduledDeparture,
                currentTime
              )}
            />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

const DepartureList: FC<{
  directions: Array<Direction>;
  departures: Array<Departure>;
  routes: Array<Route>;
}> = ({ departures, routes, directions }) => {
  return (
    <Card>
      <CardContent>
        <Typography>Trams</Typography>
        <Box
          sx={{
            px: 2,
          }}
        >
          {directions.map((direction) => (
            <Card
              sx={{
                mt: 2,
              }}
              key={direction.directionId}
            >
              <CardContent>Towards {direction.directionName}</CardContent>
              {routes
                .filter((r) => r.routeId == direction.routeId)
                .map((route) => (
                  <RouteItem
                    key={route.routeId}
                    route={route}
                    departures={departures.filter(
                      (departure) =>
                        departure.routeId == route.routeId &&
                        departure.directionId == direction.directionId
                    )}
                  />
                ))}
            </Card>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default DepartureList;
