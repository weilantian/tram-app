import { useParams } from "next/navigation";
import { FC } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { getDepartures, getStopDetail } from "@/lib/endpoint";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const DeparturePage: FC<{
  params: { id: string };
}> = async ({ params }) => {
  const stop = await getStopDetail(Number(params.id));
  const departures = await getDepartures(Number(params.id));
  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2">
            {stop?.stopName}
          </Typography>
          <Typography color="grey" variant="body1" component="p">
            {stop?.stopLandmark}
          </Typography>
          <Stack direction="row" spacing={0.4}>
            {stop?.routes.map((route) => (
              <Chip
                key={route.routeNumber}
                label={route.routeNumber}
                color="primary"
              />
            ))}
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography>Disruptions</Typography>
          <Box sx={{ mt: 2 }}>
            {departures?.disruptions.map((disruption) => (
              <Accordion key={disruption.id}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={600}>{disruption.title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>{disruption.description}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography>Trams</Typography>
          <Box
            sx={{
              px: 2,
            }}
          >
            {departures?.routes.map((route) => (
              <Card key={route.routeId}>
                <CardContent>
                  <Stack direction="row">
                    <Box>
                      <Typography>{route.routeNumber}</Typography>
                    </Box>
                    <Box>
                      <Typography>{route.routeName}</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DeparturePage;
