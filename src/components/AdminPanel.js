// src/components/AdminPanel.jsx
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  TablePagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useNavigate } from "react-router-dom";

/* -------------------------------------------------------------------------- */
/*  AdminPanel (final version)                                                */
/*  - Manage users stored in localStorage under key "prakriti_users"          */
/*  - Export JSON/CSV, Delete, View details                                   */
/*  - "Impersonate & Open" loads a user's data into localStorage and          */
/*    redirects to /dashboard/profile                                         */
/*  - "Open Dashboard" opens admin’s own dashboard                            */
/* -------------------------------------------------------------------------- */

const USERS_KEY = "prakriti_users";

const safeParse = (s) => {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
};

const uid = () => `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

const downloadFile = (content, filename, mime = "text/plain;charset=utf-8;") => {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
};

export default function AdminPanel() {
  const navigate = useNavigate();

  // Load users list
  const [users, setUsers] = useState(() => {
    const raw = localStorage.getItem(USERS_KEY);
    const parsed = safeParse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  });

  // Local (current) data
  const localProfile = useMemo(() => safeParse(localStorage.getItem("prakriti_profile")), []);
  const localResult = useMemo(() => safeParse(localStorage.getItem("prakriti_result")), []);
  const localFollowups = useMemo(() => safeParse(localStorage.getItem("prakriti_followups")), []);

  // UI state
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [page, setPage] = useState(0);
  const rowsPerPage = 6;

  // Persist users
  useEffect(() => {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch { }
  }, [users]);

  const filtered = users.filter((u) => {
    if (!filter) return true;
    const f = filter.toLowerCase();
    const name = (u.profile?.name || "").toLowerCase();
    const prak = (u.result?.prakriti || "").toLowerCase();
    return name.includes(f) || prak.includes(f);
  });

  // Helpers
  const addLocalAsUser = () => {
    if (!localProfile && !localResult && !localFollowups) {
      alert("No local profile/result/follow-ups found in localStorage to save.");
      return;
    }
    const user = {
      id: uid(),
      createdAt: new Date().toISOString(),
      profile: localProfile || null,
      result: localResult || null,
      followups: localFollowups || null,
    };
    setUsers((p) => [user, ...p]);
    setPage(0);
  };

  const viewUser = (user) => setSelected(user);
  const doDelete = (id) => {
    setUsers((p) => p.filter((u) => u.id !== id));
    setConfirmDelete(null);
    if (selected?.id === id) setSelected(null);
  };

  const exportUserJSON = (user) => {
    const filename = `${user.profile?.name || "user"}_${user.id}.json`;
    downloadFile(JSON.stringify(user, null, 2), filename, "application/json");
  };

  const exportUserCSV = (user) => {
    const headers = ["id", "name", "age", "prakriti", "answers_count", "followups_count", "createdAt"];
    const vals = [
      user.id,
      user.profile?.name ?? "",
      user.profile?.age ?? "",
      user.result?.prakriti ?? "",
      Array.isArray(user.result?.answers) ? user.result.answers.length : "",
      Array.isArray(user.followups) ? user.followups.length : "",
      user.createdAt ?? "",
    ];
    const csv = [headers.join(","), vals.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")].join("\n");
    const filename = `${user.profile?.name || "user"}_${user.id}.csv`;
    downloadFile(csv, filename, "text/csv;charset=utf-8;");
  };

  const exportAllJSON = () => {
    downloadFile(JSON.stringify(users, null, 2), `prakriti_users_${Date.now()}.json`, "application/json");
  };

  const clearAllUsers = () => {
    if (!window.confirm("Clear ALL saved users? This cannot be undone.")) return;
    setUsers([]);
  };

  const handleChangePage = (_, newPage) => setPage(newPage);

  /* ------------------------- New Feature -------------------------- */
  const impersonateAndOpenDashboard = (user) => {
    if (!user) return;
    const ok = window.confirm(
      `Impersonate "${user.profile?.name || "user"}"? This will overwrite local profile/result/follow-ups and open the Dashboard as that user.`
    );
    if (!ok) return;

    try {
      if (user.profile) localStorage.setItem("prakriti_profile", JSON.stringify(user.profile));
      else localStorage.removeItem("prakriti_profile");

      if (user.result) localStorage.setItem("prakriti_result", JSON.stringify(user.result));
      else localStorage.removeItem("prakriti_result");

      if (user.followups) localStorage.setItem("prakriti_followups", JSON.stringify(user.followups));
      else localStorage.removeItem("prakriti_followups");
    } catch (err) {
      alert("Failed to write to localStorage: " + err.message);
    }

    navigate("/dashboard/profile");
  };
  /* ---------------------------------------------------------------- */

  return (
    <Box
      sx={{
        minHeight: "80vh",
        p: { xs: 2, md: 4 },
        display: "flex",
        justifyContent: "center",
        background: "#f4f7fb",
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 1200 }}>
        <CardContent>
          <Stack spacing={2}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  Admin Panel
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage users, quiz results, and follow-ups (stored locally).
                </Typography>
              </div>

              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  startIcon={<OpenInNewIcon />}
                  onClick={() => navigate("/dashboard")}
                >
                  Open Dashboard
                </Button>

                <Button
                  variant="contained"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={addLocalAsUser}
                >
                  Save current user
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={exportAllJSON}
                >
                  Export All (JSON)
                </Button>

                <Button color="error" variant="text" onClick={clearAllUsers}>
                  Clear All
                </Button>
              </Stack>
            </Box>

            <Divider />

            <TextField
              placeholder="Search by name or prakriti"
              size="small"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              sx={{ minWidth: 260 }}
            />

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Age</TableCell>
                    <TableCell>Prakriti</TableCell>
                    <TableCell>Follow-ups</TableCell>
                    <TableCell>Saved At</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filtered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((u) => (
                      <TableRow key={u.id} hover>
                        <TableCell>{u.profile?.name ?? "—"}</TableCell>
                        <TableCell>{u.profile?.age ?? "—"}</TableCell>
                        <TableCell>{u.result?.prakriti ?? "—"}</TableCell>
                        <TableCell>
                          {Array.isArray(u.followups) ? u.followups.length : 0}
                        </TableCell>
                        <TableCell>
                          {u.createdAt
                            ? new Date(u.createdAt).toLocaleString()
                            : "—"}
                        </TableCell>
                        <TableCell align="right">
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="flex-end"
                          >
                            <Tooltip title="View">
                              <IconButton
                                size="small"
                                onClick={() => viewUser(u)}
                              >
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Impersonate & Open Dashboard">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => impersonateAndOpenDashboard(u)}
                              >
                                <OpenInNewIcon />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Export JSON">
                              <IconButton
                                size="small"
                                onClick={() => exportUserJSON(u)}
                              >
                                <DownloadIcon />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Export CSV">
                              <Button
                                size="small"
                                onClick={() => exportUserCSV(u)}
                              >
                                CSV
                              </Button>
                            </Tooltip>

                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                onClick={() => setConfirmDelete(u.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}

                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No users found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <TablePagination
                component="div"
                count={filtered.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[rowsPerPage]}
              />
            </TableContainer>
          </Stack>
        </CardContent>
      </Card>

      {/* View dialog */}
      <Dialog
        open={!!selected}
        onClose={() => setSelected(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>User details</DialogTitle>
        <DialogContent dividers>
          {selected && (
            <Stack spacing={2}>
              <Typography variant="h6">
                {selected.profile?.name ?? "—"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Age: {selected.profile?.age ?? "—"} • Saved:{" "}
                {selected.createdAt
                  ? new Date(selected.createdAt).toLocaleString()
                  : "—"}
              </Typography>

              <Divider />

              <Typography variant="subtitle1">Profile</Typography>
              <pre style={{ whiteSpace: "pre-wrap" }}>
                {JSON.stringify(selected.profile, null, 2)}
              </pre>

              <Typography variant="subtitle1">Prakriti Result</Typography>
              <pre style={{ whiteSpace: "pre-wrap" }}>
                {JSON.stringify(selected.result, null, 2)}
              </pre>

              <Typography variant="subtitle1">Follow-ups</Typography>
              <pre style={{ whiteSpace: "pre-wrap" }}>
                {JSON.stringify(selected.followups, null, 2)}
              </pre>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => selected && exportUserJSON(selected)}
          >
            Export JSON
          </Button>
          <Button
            onClick={() => selected && exportUserCSV(selected)}
          >
            Export CSV
          </Button>
          <Button
            color="error"
            onClick={() => {
              if (selected) {
                setConfirmDelete(selected.id);
                setSelected(null);
              }
            }}
          >
            Delete
          </Button>
          <Button onClick={() => setSelected(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
      >
        <DialogTitle>Delete user?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this user and their data?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(null)}>Cancel</Button>
          <Button color="error" onClick={() => doDelete(confirmDelete)}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
