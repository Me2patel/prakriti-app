// src/pages/PrakritiResult.jsx
import React, { useEffect, useMemo } from "react";
import { Box, Card, CardContent, Typography, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

const RECOMMENDATIONS = {
  vata: {
    title: "Vata — calming & grounding",
    bullets: [
      "Favor warm, cooked foods (soups, stews).",
      "Regular meal times; avoid long fasting.",
      "Gentle oil massage (abhyanga) with warm sesame oil.",
      "Prefer warm, moist climates and layers of clothing.",
    ],
  },
  pitta: {
    title: "Pitta — cooling & soothing",
    bullets: [
      "Favor cooling foods (cucumbers, melons, milk).",
      "Avoid spicy, fried, and sour foods.",
      "Practice calming breathing & avoid midday heat.",
      "Use cooling oils like coconut for massage.",
    ],
  },
  kapha: {
    title: "Kapha — light & stimulating",
    bullets: [
      "Favor lighter, drier foods and warming spices.",
      "Stay active: brisk walks and regular exercise.",
      "Avoid heavy, oily, and cold foods.",
      "Stimulate digestion with ginger, black pepper.",
    ],
  },
};

const PrakritiResult = () => {
  const navigate = useNavigate();

  const result = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("prakriti_result")) || null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!result) {
      // no result saved → send user back to profile to take quiz
      const t = setTimeout(() => navigate("/user-profile"), 700);
      return () => clearTimeout(t);
    }
  }, [result, navigate]);

  if (!result) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6">No prakriti result found — redirecting to profile...</Typography>
      </Box>
    );
  }

  const { prakriti, profile } = result;
  const rec = RECOMMENDATIONS[prakriti] || null;

  return (
    <Box sx={{ minHeight: "80vh", p: 3, display: "flex", justifyContent: "center", background: "#f7fbff" }}>
      <Card sx={{ width: "100%", maxWidth: 820, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h4" sx={{ mb: 1 }}>
            {rec?.title ?? `Your Prakriti: ${prakriti}`}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Profile: {profile?.name ?? "—"} • Age: {profile?.age ?? "—"}
          </Typography>

          <Stack spacing={1} sx={{ mb: 3 }}>
            {rec?.bullets?.map((b, i) => (
              <Typography key={i} variant="body1">• {b}</Typography>
            ))}
          </Stack>

          <Stack direction="row" spacing={2}>
            <Button variant="outlined" onClick={() => navigate("/user-profile")}>
              Edit Profile
            </Button>
            <Button variant="contained" onClick={() => navigate("/prakriti-quiz")}>
              Retake Quiz
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PrakritiResult;
