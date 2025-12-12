// src/components/PasswordModal.jsx
import React, { useState } from "react";

/**
 * PasswordModal (reusable)
 * - open: boolean
 * - onClose: () => void
 * - onSubmit: async ({ current, newPassword })
 */
export default function PasswordModal({ open, onClose, onSubmit }) {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handle(e) {
    e.preventDefault();
    setError("");
    if (!current || !newPass) return setError("Please fill all fields");
    if (newPass.length < 6) return setError("Password must be at least 6 characters");
    if (newPass !== confirm) return setError("Passwords do not match");
    setLoading(true);
    try {
      await onSubmit({ current, newPassword: newPass });
      setCurrent(""); setNewPass(""); setConfirm("");
      onClose();
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <form onSubmit={handle} className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-gray-100">Change password</h3>

        <label className="block text-sm text-gray-700 dark:text-gray-300">Current password</label>
        <input value={current} onChange={(e) => setCurrent(e.target.value)} type="password" className="w-full p-2 border rounded mb-3 bg-white dark:bg-gray-700" />

        <label className="block text-sm text-gray-700 dark:text-gray-300">New password</label>
        <input value={newPass} onChange={(e) => setNewPass(e.target.value)} type="password" className="w-full p-2 border rounded mb-3 bg-white dark:bg-gray-700" />

        <label className="block text-sm text-gray-700 dark:text-gray-300">Confirm new password</label>
        <input value={confirm} onChange={(e) => setConfirm(e.target.value)} type="password" className="w-full p-2 border rounded mb-3 bg-white dark:bg-gray-700" />

        {error && <div className="text-sm text-red-600 mb-3">{error}</div>}

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-3 py-1 border rounded">Cancel</button>
          <button type="submit" disabled={loading} className="px-3 py-1 bg-green-600 text-white rounded">
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
