// src/components/FollowUps.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  Divider,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  LinearProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "prakriti_followups";
const USERS_KEY = "prakriti_users";
const uid = () => `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

const DEFAULT_TASKS = [
  { id: "task-walk", title: "Daily walk / gentle exercise", note: "", due: null, done: false },
  { id: "task-breakfast", title: "Follow recommended breakfast", note: "", due: null, done: false },
  { id: "task-hydrate", title: "Stay hydrated (warm water / herbal tea)", note: "", due: null, done: false },
];

export default function FollowUps() {
  const navigate = useNavigate();

  const profile = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("prakriti_profile")) || null;
    } catch {
      return null;
    }
  }, []);

  const result = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("prakriti_result")) || null;
    } catch {
      return null;
    }
  }, []);

  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch { }
    // seed defaults with unique ids
    return DEFAULT_TASKS.map((t) => ({ ...t, id: uid(), createdAt: new Date().toISOString() }));
  });

  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [due, setDue] = useState("");
  const [editId, setEditId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);

  const [snack, setSnack] = useState({ open: false, severity: "success", message: "" });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch { }
  }, [items]);

  const doneCount = items.filter((i) => i.done).length;
  const progress = items.length ? Math.round((doneCount / items.length) * 100) : 0;

  const addOrUpdate = () => {
    if (!title.trim()) {
      setSnack({ open: true, severity: "warning", message: "Please enter a title." });
      return;
    }
    if (editId) {
      setItems((prev) =>
        prev.map((p) => (p.id === editId ? { ...p, title: title.trim(), note: note.trim(), due: due || null } : p))
      );
      setEditId(null);
      setSnack({ open: true, severity: "success", message: "Follow-up updated." });
    } else {
      const newItem = { id: uid(), title: title.trim(), note: note.trim(), due: due || null, done: false, createdAt: new Date().toISOString() };
      setItems((prev) => [newItem, ...prev]);
      setSnack({ open: true, severity: "success", message: "Follow-up added." });
    }
    setTitle("");
    setNote("");
    setDue("");
  };

  const toggleDone = (id) => setItems((prev) => prev.map((p) => (p.id === id ? { ...p, done: !p.done } : p)));

  const startEdit = (id) => {
    const it = items.find((i) => i.id === id);
    if (!it) return;
    setEditId(it.id);
    setTitle(it.title);
    setNote(it.note || "");
    setDue(it.due || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmDelete = (id) => {
    setToDeleteId(id);
    setConfirmOpen(true);
  };

  const doDelete = () => {
    setItems((prev) => prev.filter((p) => p.id !== toDeleteId));
    setConfirmOpen(false);
    setToDeleteId(null);
    setSnack({ open: true, severity: "info", message: "Follow-up deleted." });
  };

  const clearAll = () => {
    if (!window.confirm("Clear all follow-ups?")) return;
    setItems([]);
    setSnack({ open: true, severity: "info", message: "All follow-ups cleared." });
  };

  // Save current profile + result + followups to AdminPanel storage key
  const saveToAdminPanel = () => {
    try {
      const usersRaw = localStorage.getItem(USERS_KEY);
      let users = [];
      if (usersRaw) {
        try {
          const parsed = JSON.parse(usersRaw);
          if (Array.isArray(parsed)) users = parsed;
        } catch { }
      }

      const userToSave = {
        id: uid(),
        createdAt: new Date().toISOString(),
        profile: profile || null,
        result: result || null,
        followups: items || [],
      };

      // Basic duplicate check: if last saved user has same profile name and same result prakriti, avoid duplicate
      const last = users[0];
      if (last && last.profile?.name === userToSave.profile?.name && last.result?.prakriti === userToSave.result?.prakriti) {
        if (!window.confirm("A similar user was recently saved. Save again?")) {
          return;
        }
      }

      users.unshift(userToSave);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      setSnack({ open: true, severity: "success", message: "Saved to Admin Panel." });
    } catch (err) {
      setSnack({ open: true, severity: "error", message: "Failed to save to Admin Panel." });
    }
  };

  const prakritiText = result?.prakriti ? `${result.prakriti.toUpperCase()}` : "Not determined";

  if (!result) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6">No prakriti result found</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Please take the Prakriti Quiz first — you'll be redirected.
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button variant="contained" onClick={() => navigate("/dashboard/profile")}>
            Create Profile
          </Button>
          <Button variant="outlined" onClick={() => navigate("/dashboard/quiz")}>
            Take Quiz
          </Button>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "80vh", p: { xs: 2, md: 4 }, display: "flex", justifyContent: "center", background: "#fbfcff" }}>
      <Card sx={{ width: "100%", maxWidth: 980 }}>
        <CardContent>
          <Stack spacing={2}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Follow Ups & Progress
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Track tasks and reminders. {profile ? `User: ${profile.name}` : ""} • Prakriti:{" "}
                <Chip label={prakritiText} size="small" sx={{ ml: 1 }} />
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Progress
              </Typography>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box sx={{ flex: 1 }}>
                  <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 2 }} />
                </Box>
                <Typography variant="body2" sx={{ minWidth: 48, textAlign: "right" }}>
                  {progress}%
                </Typography>
              </Stack>
            </Box>

            <Card>
              <CardContent>
                <Typography variant="h6">Add / Edit Follow-up</Typography>
                <Stack spacing={1} sx={{ mt: 1 }}>
                  <TextField
                    label="Title (e.g. '30-min walk')"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="Note (optional)"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="Due date (optional)"
                    type="date"
                    value={due}
                    onChange={(e) => setDue(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />

                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <Button variant="contained" onClick={addOrUpdate}>
                      {editId ? "Save" : "Add Follow-up"}
                    </Button>
                    {editId && (
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setEditId(null);
                          setTitle("");
                          setNote("");
                          setDue("");
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                    <Button variant="text" color="error" onClick={clearAll}>
                      Clear All
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>

            <Box>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Upcoming Follow-ups ({items.length})
              </Typography>

              {items.length === 0 ? (
                <Typography color="text.secondary">No follow-ups yet. Add one above.</Typography>
              ) : (
                <List>
                  {items.map((it) => (
                    <ListItem
                      key={it.id}
                      divider
                      secondaryAction={
                        <ListItemSecondaryAction>
                          <IconButton edge="end" aria-label="edit" onClick={() => startEdit(it.id)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton edge="end" aria-label="delete" onClick={() => confirmDelete(it.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      }
                    >
                      <Checkbox checked={!!it.done} onChange={() => toggleDone(it.id)} />
                      <ListItemText
                        primary={
                          <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <Typography sx={{ fontWeight: 600 }}>{it.title}</Typography>
                            {it.due ? <Chip label={new Date(it.due).toLocaleDateString()} size="small" /> : null}
                          </span>
                        }
                        secondary={it.note || `Created: ${new Date(it.createdAt).toLocaleDateString()}`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={() => navigate("/dashboard/profile")}>
                Edit Profile
              </Button>
              <Button variant="outlined" onClick={() => navigate("/dashboard/diet")}>
                View Diet Chart
              </Button>

              {/* Save to Admin Panel */}
              <Button
                variant="contained"
                color="secondary"
                onClick={saveToAdminPanel}
                title="Save current user, result and follow-ups to Admin Panel"
              >
                Save to Admin Panel
              </Button>

              <Button variant="contained" onClick={() => navigate("/dashboard/schedule")}>
                Back to Daily Schedule
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* delete confirmation */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Delete follow-up?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this follow-up? This cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button color="error" onClick={doDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={2500}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnack((s) => ({ ...s, open: false }))} severity={snack.severity} sx={{ width: "100%" }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
