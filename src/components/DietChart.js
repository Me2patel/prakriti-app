// src/components/DietChart.jsx
import React, { useMemo } from "react";
import { Box, Card, CardContent, Typography, Stack, Button, Divider, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";

const DIET_CHARTS = {
  vata: {
    title: "Vata — warm, grounding, and nourishing",
    breakfast: ["Warm porridge with milk or ghee", "Stewed fruits with cinnamon"],
    lunch: ["Rice/quinoa with cooked vegetables", "Moong dal soup"],
    dinner: ["Light khichdi or stew", "Warm milk with cardamom"],
    snacks: ["Soaked almonds, baked apple"],
    beverages: ["Warm water, ginger tea"],
    avoid: ["Raw salads in excess, cold dry foods", "Skipping meals"],
    tips: ["Eat regularly, prefer warm cooked meals", "Use sesame oil for cooking/massage"],
  },
  pitta: {
    title: "Pitta — cooling, calming, and less spicy",
    breakfast: ["Cooling smoothie with cucumber & mint", "Oat porridge with pear"],
    lunch: ["Rice/barley with greens", "Lentils with cilantro"],
    dinner: ["Light khichdi, steamed veggies", "Avoid heavy late meals"],
    snacks: ["Fresh fruit, coconut"],
    beverages: ["Coconut water, mint tea"],
    avoid: ["Hot/spicy foods, fried items", "Excess alcohol/caffeine"],
    tips: ["Stay cool midday", "Prefer sweet/bitter tastes"],
  },
  kapha: {
    title: "Kapha — light, warm, and stimulating",
    breakfast: ["Barley porridge with ginger", "Light vegetable stir-fry"],
    lunch: ["Cooked grains + steamed vegetables", "Warming spices"],
    dinner: ["Lentil soup, kitchari", "Avoid heavy meals at night"],
    snacks: ["Dry roasted nuts, apple"],
    beverages: ["Warm lemon water, ginger tea"],
    avoid: ["Cold dairy, heavy sweets, fried foods", "Overeating"],
    tips: ["Stay active, prefer light & warm foods", "Avoid late-night heavy meals"],
  },
};

const DietChart = () => {
  const navigate = useNavigate();
  const result = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("prakriti_result")) || null; } catch { return null; }
  }, []);

  if (!result) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6">No prakriti result found</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>Please take the Prakriti Quiz first — you’ll be redirected.</Typography>
        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button variant="contained" onClick={() => navigate("/dashboard/profile")}>Create Profile</Button>
          <Button variant="outlined" onClick={() => navigate("/dashboard/quiz")}>Take Quiz</Button>
        </Stack>
      </Box>
    );
  }

  const { prakriti, profile } = result;
  const chart = DIET_CHARTS[prakriti] || null;

  return (
    <Box sx={{ minHeight: "80vh", p: { xs: 2, md: 4 }, display: "flex", justifyContent: "center", background: "#f7fbff" }}>
      <Card sx={{ width: "100%", maxWidth: 980, borderRadius: 2 }}>
        <CardContent>
          <Stack spacing={2}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>Diet Chart</Typography>
              <Typography variant="body2" color="text.secondary">Personalized for: <strong>{profile?.name ?? "—"} • Age: {profile?.age ?? "—"}</strong></Typography>
            </Box>

            <Divider />

            {!chart ? (
              <Typography>No diet chart available for: {prakriti}</Typography>
            ) : (
              <>
                <Box sx={{ textAlign: "center", py: 2 }}>
                  <Chip label={chart.title} color="primary" sx={{ fontSize: 16, py: 1 }} />
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Dominant prakriti: <strong>{prakriti}</strong></Typography>
                </Box>

                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <Card sx={{ flex: 1 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 1 }}>Meals</Typography>
                      <Typography variant="subtitle2">Breakfast</Typography>
                      <ul>{chart.breakfast.map((b, i) => <li key={i}><Typography variant="body2">{b}</Typography></li>)}</ul>
                      <Typography variant="subtitle2">Lunch</Typography>
                      <ul>{chart.lunch.map((b, i) => <li key={i}><Typography variant="body2">{b}</Typography></li>)}</ul>
                      <Typography variant="subtitle2">Dinner</Typography>
                      <ul>{chart.dinner.map((b, i) => <li key={i}><Typography variant="body2">{b}</Typography></li>)}</ul>
                    </CardContent>
                  </Card>

                  <Card sx={{ flex: 1 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 1 }}>Snacks & Drinks</Typography>
                      <Typography variant="subtitle2">Snacks</Typography>
                      <ul>{chart.snacks.map((s, i) => <li key={i}><Typography variant="body2">{s}</Typography></li>)}</ul>
                      <Typography variant="subtitle2" sx={{ mt: 1 }}>Beverages</Typography>
                      <ul>{chart.beverages.map((b, i) => <li key={i}><Typography variant="body2">{b}</Typography></li>)}</ul>
                      <Typography variant="subtitle2" sx={{ mt: 1 }}>Foods to Avoid</Typography>
                      <ul>{chart.avoid.map((a, i) => <li key={i}><Typography variant="body2">{a}</Typography></li>)}</ul>
                    </CardContent>
                  </Card>
                </Stack>

                <Card sx={{ mt: 2 }}>
                  <CardContent>
                    <Typography variant="h6">Quick Tips</Typography>
                    <ul>{chart.tips.map((t, i) => <li key={i}><Typography variant="body2">{t}</Typography></li>)}</ul>
                  </CardContent>
                </Card>

                <Stack direction="row" spacing={2} sx={{ mt: 3 }} justifyContent="flex-end">
                  <Button onClick={() => navigate("/dashboard/quiz")} variant="outlined">Retake Quiz</Button>
                  <Button onClick={() => navigate("/dashboard/profile")} variant="outlined">Edit Profile</Button>
                  <Button onClick={() => navigate("/dashboard/schedule")} variant="contained">View Daily Schedule</Button>
                  <Button variant="contained" onClick={() => window.print()}>Print / Save</Button>
                </Stack>
              </>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DietChart;
