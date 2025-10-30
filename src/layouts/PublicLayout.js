// src/layouts/PublicLayout.jsx
import React from "react";
import { AppBar, Toolbar, Typography, Button, Box, Container } from "@mui/material";
import { Link, Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar position="static" sx={{ backgroundColor: "#0B2240" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" component={Link} to="/" sx={{ color: "#fff", textDecoration: "none" }}>
            Prakriti Wellness
          </Typography>

          <Box>
            <Button component={Link} to="/" color="inherit">Home</Button>
            <Button component={Link} to="/dashboard" color="inherit">Dashboard</Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        <Outlet />
      </Container>

      <Box component="footer" sx={{ py: 3, textAlign: "center", background: "#fafafa" }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Prakriti Wellness — Local demo app
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
