// src/components/UserProfile.jsx
import React, { useState } from "react";
import { Box, Card, CardContent, TextField, Typography, Button, Grid, Avatar, Divider, Snackbar, Alert } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [form, setForm] = useState({ name: "", age: "", health: "" });
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const validate = (f) => {
    const err = {};
    if (!f.name.trim()) err.name = "Name is required.";
    if (!f.age || Number(f.age) <= 0) err.age = "Enter a valid age.";
    return err;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    localStorage.setItem("prakriti_profile", JSON.stringify(form));
    setOpen(true);
    setTimeout(() => {
      navigate("/dashboard/quiz");
    }, 500);
  };

  return (
    <Box sx={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", py: 6, px: 2, background: "#f5f7fb" }}>
      <Card sx={{ width: "100%", maxWidth: 920, borderRadius: 3, p: 2 }}>
        <Typography variant="h4" align="center" sx={{ fontWeight: 700, mb: 2 }}>Create Profile</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <form onSubmit={handleSubmit} noValidate>
              <TextField fullWidth label="Name" name="name" variant="outlined" value={form.name} onChange={handleChange} sx={{ mb: 2 }} error={!!errors.name} helperText={errors.name} required />
              <TextField fullWidth label="Age" name="age" type="number" variant="outlined" value={form.age} onChange={handleChange} sx={{ mb: 2 }} error={!!errors.age} helperText={errors.age} required />
              <TextField fullWidth multiline rows={4} label="Health Info (optional)" name="health" variant="outlined" value={form.health} onChange={handleChange} />
              <Button type="submit" variant="contained" sx={{ mt: 3 }} fullWidth>Save & Start Prakriti Quiz</Button>
            </form>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ backgroundColor: "#fafafa", height: "100%" }}>
              <CardContent sx={{ textAlign: "center" }}>
                <Avatar sx={{ width: 76, height: 76, mx: "auto", mb: 2 }}><PersonIcon sx={{ fontSize: 40 }} /></Avatar>
                <Typography variant="h6" fontWeight="600">{form.name || "Your Name"}</Typography>
                <Typography color="text.secondary">Age: {form.age || "--"}</Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2">{form.health || "Add any relevant health notes. These are saved locally."}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Card>

      <Snackbar open={open} autoHideDuration={1200} onClose={() => setOpen(false)}>
        <Alert severity="success" sx={{ width: "100%" }}>Profile saved successfully! Redirecting to quiz...</Alert>
      </Snackbar>
    </Box>
  );
};

export default UserProfile;
