// src/App.jsx
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

// Layouts
const PublicLayout = lazy(() => import("./layouts/PublicLayout"));
const Dashboard = lazy(() => import("./pages/Dashboard"));

// Pages & components (lazy)
const UserProfile = lazy(() => import("./components/UserProfile"));
const PrakritiQuiz = lazy(() => import("./components/PrakritiQuiz"));
const DietChart = lazy(() => import("./components/DietChart"));
const DailySchedule = lazy(() => import("./components/DailySchedule"));
const FollowUps = lazy(() => import("./components/FollowUps"));
const AdminPanel = lazy(() => import("./components/AdminPanel"));
const PrakritiResult = lazy(() => import("./pages/PrakritiResult"));

function App() {
  return (
    <Router>
      <Suspense fallback={<div style={{ padding: 24 }}>Loading…</div>}>
        <Routes>
          {/* Public layout */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
          </Route>

          {/* Dashboard layout + nested children */}
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="quiz" element={<PrakritiQuiz />} />
            <Route path="diet" element={<DietChart />} />
            <Route path="schedule" element={<DailySchedule />} />
            <Route path="followups" element={<FollowUps />} />
            <Route path="admin" element={<AdminPanel />} />
            <Route path="result" element={<PrakritiResult />} />
          </Route>

          {/* Backwards-compatible aliases (optional) */}
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/prakriti-quiz" element={<PrakritiQuiz />} />
          <Route path="/prakriti-result" element={<PrakritiResult />} />
          <Route path="/diet-chart" element={<DietChart />} />
          <Route path="/daily-schedule" element={<DailySchedule />} />
          <Route path="/follow-ups" element={<FollowUps />} />
          <Route path="/admin-panel" element={<AdminPanel />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
