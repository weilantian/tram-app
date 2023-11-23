import { getRoutes, searchStops } from "@/lib/endpoint";
import Image from "next/image";
import popularStops from "@/lib/constants/popularStops";
import {
  Card,
  Box,
  CardContent,
  Stack,
  Typography,
  Chip,
  Button,
  Input,
  TextField,
} from "@mui/material";
import Link from "next/link";

export default async function Home({
  searchParams: { searchTerm },
}: {
  searchParams: { searchTerm: string };
}) {
  const foundStops = await searchStops(searchTerm);

  return (
    <main>
      <form action="/">
        <Stack direction="row">
          <TextField
            defaultValue={searchTerm}
            name="searchTerm"
            fullWidth
            id="outlined-basic"
            label="Search for stop..."
            variant="outlined"
          />
          <Button type="submit">Search</Button>
        </Stack>
      </form>

      <Stack sx={{ mt: 2 }}>
        {foundStops.map((stop) => (
          <Link key={stop.stopId} href={`/stops/${stop.stopId}`}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {stop.stopName}
                </Typography>
                <Stack direction="row" spacing={0.4}></Stack>
              </CardContent>
            </Card>
          </Link>
        ))}
      </Stack>

      <Typography variant="subtitle1">Nearby Stops</Typography>
      <Button>Get Nearby Stops</Button>
      <Stack sx={{ mt: 2 }}>
        {popularStops.map((stop) => (
          <Card key={stop.stopId}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {stop.stopName}
              </Typography>
              <Stack direction="row" spacing={0.4}>
                {stop.routes.map((route) => (
                  <Chip key={route} label={route} color="primary" />
                ))}
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </main>
  );
}
