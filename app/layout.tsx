import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Box, Button } from "@mui/material";
import "@/app/globals.css";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "Tram App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <Box
          sx={{
            pt: 12,
            px: 2,
          }}
        >
          {children}
        </Box>
      </body>
    </html>
  );
}
