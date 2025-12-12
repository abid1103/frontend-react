// src/pages/Settings.jsx
import React, { useEffect, useState } from "react";
import { api2faSetup, api2faVerify } from "../api";
import { useNavigate } from "react-router-dom";

/**
 * Settings page:
 * - View Profile link (opens /profile)
 * - Theme toggle (persisted)
 * - Two-factor setup & verify (TOTP)
 * - Change password is on /profile (we provide button there)
 */

export default function Settings() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("bi_theme") || "light");
  const [qr, setQr] = useState(null);
  const [twofaCode, setTwofaCode] = useState("");
  const [twofaEnabled, setTwofaEnabled] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("bi_theme", theme);
  }, [theme]);

  async function handleSetup2fa() {
    setError("");
    try {
      const res = await api2faSetup();
      setQr(res.data.qr_base64);
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || "Failed to setup 2FA");
    }
  }

  async function handleVerify2fa() {
    setError("");
    try {
      await api2faVerify({ code: twofaCode });
      setTwofaEnabled(true);
      setQr(null);
      setTwofaCode("");
      alert("Two-factor enabled");
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || "Invalid code");
    }
  }

  return (
    <div className="p-6">
      <div className="bg-white dark:bg-gray-900 shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-semibold mb-4">Settings</h2>

        {/* Profile */}
        <section className="mb-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <div className="font-medium">Profile</div>
              <div className="text-sm text-gray-500 dark:text-gray-300">View or update your profile</div>
            </div>
            <div>
              <button onClick={() => navigate("/profile")} className="px-4 py-2 bg-blue-600 text-white rounded-md">
                View Profile
              </button>
            </div>
          </div>
        </section>

        {/* Theme */}
        <section className="mb-6">
          <h3 className="text-lg font-medium mb-3">Appearance</h3>
          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border rounded-lg">
            <div>
              <div className="font-medium">Theme</div>
              <div className="text-sm text-gray-500 dark:text-gray-300">Toggle dark mode for the app</div>
            </div>
            <div>
              <button
                onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
                className="px-3 py-1 border rounded-md"
              >
                {theme === "light" ? "Switch to Dark" : "Switch to Light"}
              </button>
            </div>
          </div>
        </section>

        {/* Two-Factor */}
        <section>
          <h3 className="text-lg font-medium mb-3">Two-Factor Authentication (TOTP)</h3>
          <div className="p-4 bg-white dark:bg-gray-800 border rounded-lg">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="font-medium">Authenticator App</div>
                <div className="text-sm text-gray-500 dark:text-gray-300">Scan QR with an authenticator app and verify the code to enable 2FA.</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleSetup2fa} className="px-3 py-1 border rounded">Setup</button>
              </div>
            </div>

            {qr && (
              <div className="mt-4 flex gap-4 items-center">
                <img src={`data:image/png;base64,${qr}`} alt="2FA QR" className="w-40 h-40 object-contain border" />
                <div className="flex flex-col gap-2">
                  <input value={twofaCode} onChange={(e) => setTwofaCode(e.target.value)} placeholder="Enter code from app" className="border p-2 rounded" />
                  <button onClick={handleVerify2fa} className="px-3 py-1 bg-green-600 text-white rounded">Verify</button>
                </div>
              </div>
            )}

            {error && <div className="text-sm text-red-600 mt-3">{error}</div>}
          </div>
        </section>

        {/* Change password pointer */}
        <section className="mt-6">
          <h3 className="text-lg font-medium mb-3">Security</h3>
          <div className="p-4 bg-white dark:bg-gray-800 border rounded-lg flex items-center justify-between">
            <div>
              <div className="font-medium">Change password</div>
              <div className="text-sm text-gray-500 dark:text-gray-300">Change your account password (secure prompt on profile page)</div>
            </div>
            <div>
              <button onClick={() => navigate("/profile")} className="px-3 py-1 bg-blue-600 text-white rounded">Go to Profile</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
