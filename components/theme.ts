import { Roboto } from "next/font/google";
import { createTheme } from "@mui/material/styles";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#78be1f",
    },

    secondary: {
      main: "#01653a",
    },
  },
  shape: {
    borderRadius: 4,
  },
});

export default theme;
