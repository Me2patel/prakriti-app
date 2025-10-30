// src/pages/Dashboard.jsx
import React, { useMemo, useState } from "react";
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  AppBar, Toolbar, Typography, IconButton, CssBaseline, Divider, Button
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import QuizIcon from "@mui/icons-material/Quiz";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import ScheduleIcon from "@mui/icons-material/Schedule";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const drawerWidth = 220;

const menuItems = [
  { label: "User Profile", path: "profile", icon: <PersonIcon /> },
  { label: "Prakriti Quiz", path: "quiz", icon: <QuizIcon /> },
  { label: "Diet Chart", path: "diet", icon: <RestaurantIcon /> },
  { label: "Daily Schedule", path: "schedule", icon: <ScheduleIcon /> },
  { label: "Follow Ups", path: "followups", icon: <ListAltIcon /> },
  { label: "Admin Panel", path: "admin", icon: <AdminPanelSettingsIcon /> },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const profile = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("prakriti_profile")) || null; } catch { return null; }
  }, []);

  const toggleDrawer = () => setMobileOpen((prev) => !prev);

  const drawer = (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div>
        <Toolbar sx={{ px: 2 }}>
          <Typography variant="h6" noWrap>Prakriti</Typography>
        </Toolbar>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton component={NavLink} to={item.path} end
                style={({ isActive }) => ({
                  backgroundColor: isActive ? "#0B2240" : undefined,
                  color: isActive ? "#fff" : undefined,
                  borderRadius: "0 24px 24px 0",
                  marginRight: "8px",
                })}
              >
                <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </div>

      <Box sx={{ p: 2 }}>
        <Divider sx={{ mb: 1 }} />
        <Button variant="outlined" fullWidth color="error" onClick={() => {
          if (window.confirm("Clear local demo data (profile, result, followups)?")) {
            localStorage.removeItem("prakriti_profile");
            localStorage.removeItem("prakriti_result");
            localStorage.removeItem("prakriti_followups");
            alert("Local data cleared successfully.");
            window.location.reload();
          }
        }}>
          Clear Local Data
        </Button>
      </Box>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1, backgroundColor: "#0B2240", boxShadow: "none" }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={toggleDrawer} sx={{ mr: 2, display: { sm: "none" } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>Prakriti Dashboard</Typography>
          {profile && <Typography variant="body2" sx={{ mr: 2 }}>👋 {profile.name}</Typography>}
          <Button color="inherit" onClick={() => navigate("/")}>Home</Button>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer variant="temporary" open={mobileOpen} onClose={toggleDrawer} ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: "block", sm: "none" }, "& .MuiDrawer-paper": { width: drawerWidth } }}>
          {drawer}
        </Drawer>

        <Drawer variant="permanent" open sx={{ display: { xs: "none", sm: "block" }, "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box", borderRight: "1px solid #e0e0e0" } }}>
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, width: { sm: `calc(100% - ${drawerWidth}px)` }, mt: 8, backgroundColor: "#f5f7fb", minHeight: "100vh" }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Dashboard;
