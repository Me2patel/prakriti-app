// src/pages/Home.jsx
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Stack,
  Divider,
} from "@mui/material";
import SpaIcon from "@mui/icons-material/Spa";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ScheduleIcon from "@mui/icons-material/Schedule";

export default function Home() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#ffffff",
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          backgroundColor: "#0B2240",
          color: "white",
          py: { xs: 6, md: 10 },
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 2,
              lineHeight: 1.1,
            }}
          >
            Welcome to Prakriti Wellness
          </Typography>

          <Typography
            variant="h6"
            sx={{
              mb: 4,
              color: "rgba(255,255,255,0.85)",
              fontWeight: 400,
            }}
          >
            Discover your Ayurvedic constitution (Prakriti), get personalized
            diet & daily routines, track follow-ups and save users in the admin
            panel — all on a lightweight local demo app.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
            sx={{ mb: 5 }}
          >
            <Button
              component={RouterLink}
              to="/dashboard"
              variant="contained"
              size="large"
              sx={{
                px: 4,
                fontWeight: 600,
                backgroundColor: "#1976d2",
                "&:hover": { backgroundColor: "#1565c0" },
              }}
            >
              Go to Dashboard
            </Button>

            <Button
              component={RouterLink}
              to="/dashboard/quiz"
              variant="outlined"
              size="large"
              sx={{
                px: 4,
                color: "white",
                borderColor: "rgba(255,255,255,0.4)",
                fontWeight: 600,
                "&:hover": { borderColor: "white" },
              }}
            >
              Take the Prakriti Quiz
            </Button>
          </Stack>

          {/* Centered Logo Box */}
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Card
              sx={{
                maxWidth: 420,
                width: "100%",
                borderRadius: 3,
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(6px)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
              }}
            >
              <CardContent>
                <Stack spacing={1.5} alignItems="center" justifyContent="center">
                  <Avatar
                    sx={{
                      bgcolor: "white",
                      width: 84,
                      height: 84,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    }}
                  >
                    <SpaIcon sx={{ color: "#0B2240", fontSize: 40 }} />
                  </Avatar>
                  <Typography
                    variant="h6"
                    sx={{ color: "white", fontWeight: 600 }}
                  >
                    Personalized Wellness
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255,255,255,0.8)",
                      textAlign: "center",
                      lineHeight: 1.6,
                      px: 2,
                    }}
                  >
                    Quick prakriti assessment, recommended diet, routine and
                    follow-ups — designed for easy local use.
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Typography
          variant="h4"
          align="center"
          sx={{ fontWeight: 700, mb: 4, color: "#0B2240" }}
        >
          What You Can Do
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 2,
                boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
              }}
            >
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: "#0B2240" }}>
                    <MenuBookIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Take the Quiz
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Short guided questions to determine your dominant prakriti
                      and store results locally.
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 2,
                boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
              }}
            >
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: "#0B2240" }}>
                    <ScheduleIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Personalized Plans
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Diet charts and daily schedules tailored to your prakriti —
                      simple, actionable guidance.
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 2,
                boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
              }}
            >
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: "#0B2240" }}>
                    <SpaIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Track & Save
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Add follow-ups, save user records to the Admin Panel, and
                      review progress over time.
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Divider sx={{ my: 5 }} />

        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 800, mx: "auto" }}>
            Built as a demo & learning app — all data is stored locally in your
            browser. For production, connect your Admin Panel to a backend and
            add authentication.
          </Typography>
        </Box>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 4,
          mt: "auto",
          background: "#fafafa",
          borderTop: "1px solid #eee",
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Prakriti Wellness
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button component={RouterLink} to="/dashboard" size="small">
              Dashboard
            </Button>
            <Button component={RouterLink} to="/dashboard/quiz" size="small">
              Prakriti Quiz
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
