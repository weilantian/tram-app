import { Box, Toolbar, IconButton, Typography, Button } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
const NavBar = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Link href="/">
            <Typography variant="h6" component="div">
              Melborune Tram Tracker
            </Typography>
          </Link>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;
