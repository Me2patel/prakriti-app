// src/components/PrakritiQuiz.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, Card, CardContent, LinearProgress, Typography, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import questions from "../data/prakritiQuestions";

const PrakritiQuiz = ({ onComplete }) => {
  const navigate = useNavigate();
  const safeQuestions = Array.isArray(questions) ? questions : [];
  const total = safeQuestions.length;

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [finished, setFinished] = useState(false);

  const profile = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("prakriti_profile")) || null; } catch { return null; }
  }, []);

  useEffect(() => {
    if (!profile) {
      const t = setTimeout(() => navigate("/dashboard/profile"), 600);
      return () => clearTimeout(t);
    }
  }, [profile, navigate]);

  if (total === 0) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6">No quiz questions found.</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>Check your `src/data/prakritiQuestions` file — it should export an array.</Typography>
      </Box>
    );
  }

  const calculatePrakriti = (ansArray) => {
    const score = { vata: 0, pitta: 0, kapha: 0 };
    ansArray.forEach((a) => { if (score[a] !== undefined) score[a]++; });
    const sorted = Object.entries(score).sort((a, b) => b[1] - a[1]);
    if (sorted.length > 1 && sorted[0][1] === sorted[1][1]) {
      const priority = ["vata", "pitta", "kapha"];
      for (let p of priority) if (score[p] === sorted[0][1]) return p;
    }
    return sorted[0][0];
  };

  const handleAnswer = (optionType) => {
    if (processing || finished) return;
    setProcessing(true);

    setAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers, optionType];

      if (current >= total - 1) {
        const prakriti = calculatePrakriti(newAnswers);
        localStorage.setItem("prakriti_result", JSON.stringify({ prakriti, answers: newAnswers, profile }));
        setFinished(true);
        if (typeof onComplete === "function") onComplete(prakriti);
      } else {
        setCurrent((c) => Math.min(c + 1, total - 1));
      }

      setProcessing(false);
      return newAnswers;
    });
  };

  const goBack = () => {
    if (processing || finished) return;
    if (current === 0) return;
    setAnswers((prev) => {
      const updated = prev.slice(0, -1);
      setCurrent((c) => Math.max(0, c - 1));
      return updated;
    });
  };

  const restart = () => {
    setCurrent(0);
    setAnswers([]);
    setFinished(false);
    setProcessing(false);
    localStorage.removeItem("prakriti_result");
  };

  const q = safeQuestions[current];

  return (
    <Box sx={{ minHeight: "80vh", p: 3, display: "flex", justifyContent: "center", background: "#f8fbff" }}>
      <Card sx={{ width: "100%", maxWidth: 820, borderRadius: 2 }}>
        <CardContent>
          <Stack spacing={2}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>Prakriti Quiz</Typography>
              {profile && <Typography variant="body2" color="text.secondary">Profile: {profile.name} • Age: {profile.age}</Typography>}
            </Box>

            <LinearProgress variant="determinate" value={(answers.length / total) * 100} />

            {!finished ? (
              <>
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>Question {Math.min(current + 1, total)} / {total}</Typography>
                  <Typography variant="h6" sx={{ mb: 2 }}>{q?.question ?? "Question not found"}</Typography>

                  <Stack spacing={1}>
                    {(q?.options ?? []).map((opt, idx) => (
                      <Button key={idx} onClick={() => handleAnswer(opt.type)} disabled={processing} variant="outlined" sx={{ justifyContent: "flex-start", textTransform: "none" }}>
                        {opt.text}
                      </Button>
                    ))}
                  </Stack>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                  <Button disabled={current === 0 || processing} onClick={goBack}>Back</Button>
                  <Typography variant="body2" color="text.secondary">{answers.length} answered</Typography>
                </Box>
              </>
            ) : (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="h5" sx={{ mb: 1 }}>Your dominant Prakriti is:</Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>{calculatePrakriti(answers)}</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>(Saved to local storage.)</Typography>

                <Stack direction="row" spacing={2} justifyContent="center">
                  <Button onClick={() => navigate("/dashboard/profile")} variant="outlined">Back to Profile</Button>
                  <Button onClick={() => navigate("/dashboard/diet")} variant="contained">View Recommendations</Button>
                  <Button onClick={() => { restart(); }} variant="text">Retake</Button>
                </Stack>
              </Box>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PrakritiQuiz;
