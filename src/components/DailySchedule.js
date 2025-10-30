// src/components/DailySchedule.jsx
import React, { useMemo } from "react";
import { Box, Card, CardContent, Typography, Stack, Button, Divider, Chip, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

const DAILY_SCHEDULES = {
  vata: {
    title: "Vata Daily Routine — grounding & stabilizing",
    schedule: [
      { time: "6:00 AM", activity: "Wake up early, drink a cup of warm water" },
      { time: "6:15 AM", activity: "Gentle oil massage (warm sesame oil) + warm shower" },
      { time: "7:00 AM", activity: "Light yoga or stretching (slow, calming)" },
      { time: "8:00 AM", activity: "Warm cooked breakfast (porridge or khichdi)" },
      { time: "10:30 AM", activity: "Short walk, avoid overstimulation" },
      { time: "1:00 PM", activity: "Warm, cooked lunch (main meal)" },
      { time: "3:30 PM", activity: "Light warm snack (soaked nuts or baked fruit)" },
      { time: "6:00 PM", activity: "Gentle exercise or calming walk" },
      { time: "7:30 PM", activity: "Warm light dinner (soup or khichdi)" },
      { time: "9:00 PM", activity: "Wind down, warm herbal tea (cinnamon/ginger)" },
      { time: "10:00 PM", activity: "Sleep (regular bedtime helps balance vata)" },
    ],
    tips: ["Keep regular meal and sleep times.", "Favor warmth, grounding routines and gentle touch.", "Avoid excessive stimulation and cold/raw foods."],
  },
  pitta: {
    title: "Pitta Daily Routine — cooling & calming",
    schedule: [
      { time: "6:00 AM", activity: "Wake up before sunrise, sip room-temp water" },
      { time: "6:30 AM", activity: "Cooling breathing exercises / moderate yoga" },
      { time: "7:30 AM", activity: "Cooling breakfast (oat porridge, fruits)" },
      { time: "10:30 AM", activity: "Short break; avoid midday heat" },
      { time: "1:00 PM", activity: "Main meal (largest meal), include cooling veggies" },
      { time: "3:30 PM", activity: "Fresh fruit or coconut water" },
      { time: "6:00 PM", activity: "Light activity/relaxing walk (avoid aggressive workouts at peak heat)" },
      { time: "7:30 PM", activity: "Light dinner (steamed veg or khichdi)" },
      { time: "9:00 PM", activity: "Soothing routine — cooling tea (mint/coriander)" },
      { time: "10:00 PM", activity: "Bedtime (avoid late night work or heated arguments)" },
    ],
    tips: ["Avoid heavy spices and midday overheating.", "Include cooling foods and calm the mind with breathing.", "Keep a consistent sleep schedule and avoid stimulants."],
  },
  kapha: {
    title: "Kapha Daily Routine — energizing & stimulating",
    schedule: [
      { time: "5:30 AM", activity: "Wake up early; splash warm water on face" },
      { time: "6:00 AM", activity: "Energizing exercise (brisk walk, jogging, cardio)" },
      { time: "7:00 AM", activity: "Warm, light breakfast (barley or millet porridge with spices)" },
      { time: "10:30 AM", activity: "Activity break — avoid long sedentary stretches" },
      { time: "1:00 PM", activity: "Main meal (lighter than vata/pitta, favor warming spices)" },
      { time: "3:30 PM", activity: "Light snack if hungry (roasted nuts, ginger tea)" },
      { time: "6:00 PM", activity: "Active evening — yoga, brisk walk or light sport" },
      { time: "7:30 PM", activity: "Light, early dinner (soups, steamed veg)" },
      { time: "9:00 PM", activity: "Wind down; calming activities but avoid heavy sedatives" },
      { time: "10:00 PM", activity: "Sleep — earlier bedtime to avoid kapha stagnation" },
    ],
    tips: ["Stay active during the day; avoid long naps and heavy dinners.", "Prefer warm, dry, and light foods; use stimulating spices.", "Build routines that boost energy and circulation."],
  },
};

const DailySchedule = () => {
  const navigate = useNavigate();
  const result = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("prakriti_result")) || null; } catch { return null; }
  }, []);

  if (!result) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6">No prakriti result found</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>Please take the Prakriti Quiz first — you'll be redirected.</Typography>
        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button variant="contained" onClick={() => navigate("/dashboard/profile")}>Create Profile</Button>
          <Button variant="outlined" onClick={() => navigate("/dashboard/quiz")}>Take Quiz</Button>
        </Stack>
      </Box>
    );
  }

  const { prakriti, profile } = result;
  const data = DAILY_SCHEDULES[prakriti] || null;

  return (
    <Box sx={{ minHeight: "80vh", p: { xs: 2, md: 4 }, display: "flex", justifyContent: "center", background: "#fffaf6" }}>
      <Card sx={{ width: "100%", maxWidth: 1000, borderRadius: 2 }}>
        <CardContent>
          <Stack spacing={2}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>Daily Schedule</Typography>
              <Typography variant="body2" color="text.secondary">Personalized for: <strong>{profile?.name ?? "—"} • Age: {profile?.age ?? "—"}</strong></Typography>
            </Box>

            <Divider />

            {!data ? <Typography>No schedule available for: {prakriti}</Typography> : (
              <>
                <Box sx={{ textAlign: "center", py: 1 }}>
                  <Chip label={data.title} color="primary" sx={{ fontSize: 15, py: 0.8 }} />
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Dominant prakriti: <strong>{prakriti}</strong></Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <Card sx={{ mb: 2 }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 1 }}>Recommended Routine</Typography>
                        <Stack spacing={1}>
                          {data.schedule.map((s, idx) => (
                            <Box key={idx} sx={{ display: "flex", gap: 2 }}>
                              <Typography sx={{ width: 100, fontWeight: 600 }}>{s.time}</Typography>
                              <Typography>{s.activity}</Typography>
                            </Box>
                          ))}
                        </Stack>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent>
                        <Typography variant="h6">Practical Tips</Typography>
                        <ul>{data.tips.map((t, i) => <li key={i}><Typography variant="body2">{t}</Typography></li>)}</ul>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 1 }}>Quick Actions</Typography>
                        <Stack spacing={1}>
                          <Button variant="contained" onClick={() => navigate("/dashboard/diet")}>View Diet Chart</Button>
                          <Button variant="outlined" onClick={() => navigate("/dashboard/profile")}>Edit Profile</Button>
                          <Button variant="outlined" onClick={() => navigate("/dashboard/quiz")}>Retake Quiz</Button>
                          <Button variant="contained" onClick={() => navigate("/dashboard/followups")}>Go to Follow Ups</Button>
                          <Button variant="text" onClick={() => window.print()}>Print Schedule</Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DailySchedule;
