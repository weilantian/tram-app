"use client";

import { Departure, Direction, Route } from "@/lib/models";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Chip,
  NoSsr,
} from "@mui/material";
import { FC, useCallback, useEffect, useState } from "react";
import { format, formatDistance } from "date-fns";
import { AccessTime } from "@mui/icons-material";
import RssFeedIcon from "@mui/icons-material/RssFeed";

const RouteItem: FC<{ route: Route; departures: Array<Departure> }> = ({
  route,
  departures,
}) => {
  const [currentTime, setCurrentTime] = useState(
    new Date("2021-10-10T10:00:00+10:00")
  );
  const computerateLatestDeparture = useCallback(() => {
    return departures
      .filter(
        (departure) =>
          (departure.estimatedDeparture?.getTime() ??
            departure.scheduledDeparture.getTime()) > currentTime.getTime()
      )
      .sort(
        (a, b) =>
          new Date(a.estimatedDeparture ?? a.scheduledDeparture).getTime() -
          new Date(b.estimatedDeparture ?? b.scheduledDeparture).getTime()
      )[0];
  }, [departures, currentTime]);

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

              <Chip
                sx={{
                  mt: 1,
                }}
                icon={<AccessTime />}
                label={format(
                  latestDeparture?.estimatedDeparture ??
                    latestDeparture?.scheduledDeparture!,
                  "HH:mm"
                )}
              ></Chip>
            </Box>
          </Stack>
          {(latestDeparture?.estimatedDeparture ||
            latestDeparture?.scheduledDeparture) && (
            <Chip
              color={
                latestDeparture?.estimatedDeparture ? "success" : "default"
              }
              icon={
                latestDeparture?.estimatedDeparture ? (
                  <RssFeedIcon
                    sx={{
                      fontSize: 16,
                    }}
                  />
                ) : undefined
              }
              variant="outlined"
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
        <Box>
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
