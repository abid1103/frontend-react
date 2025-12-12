// app.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Trends from "./pages/Trends";
import Sentiment from "./pages/Sentiment";
import Forecast from "./pages/Forecast";
import Settings from "./pages/Settings"; // NEW
import Profile from "./pages/Profile";   // NEW
import Recommendations from "./pages/Recommendations";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Use Layout for all pages */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="trends" element={<Trends />} />
          <Route path="sentiment" element={<Sentiment />} />
          <Route path="forecast" element={<Forecast />} />
          <Route path="settings" element={<Settings />} /> {/* Settings page */}
          <Route path="profile" element={<Profile />} />   {/* Profile-only page */}
          <Route path="Recommendations" element={<Recommendations />} />
        </Route>

          <Route path="AdminLogin" element={<AdminLogin />} />
          <Route path="AdminDashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

