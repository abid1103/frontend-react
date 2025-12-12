// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { apiGetProfile, apiUpdateProfile, apiUploadAvatar, apiChangePassword } from "../api";
import PasswordModal from "../components/PasswordModal";

/**
 * Profile page:
 * - Displays avatar (default fallback if missing)
 * - Edit name inline
 * - Upload avatar (calls backend /user/avatar)
 * - Change password via modal (calls /user/change-password)
 */

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState("");
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await apiGetProfile();
        if (mounted) {
          setUser(res.data);
          setName(res.data.name || "");
        }
      } catch (err) {
        console.error("Failed to load profile", err);
        // api interceptor handles 401 redirect
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  async function saveName() {
    try {
      const fd = new FormData();
      fd.append("name", name);
      await apiUpdateProfile(fd);
      setUser((u) => ({ ...u, name }));
      setEditingName(false);
      alert("Name updated");
    } catch (err) {
      alert("Failed to update name");
      console.error(err);
    }
  }

  async function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const res = await apiUploadAvatar(file);
      // backend returns { avatar_url: "/static/uploads/..." }
      setUser((u) => ({ ...u, avatar_url: res.data.avatar_url }));
      alert("Avatar uploaded");
    } catch (err) {
      alert("Avatar upload failed");
      console.error(err);
    }
  }

  async function handlePasswordChange(payload) {
    try {
      await apiChangePassword(payload);
      alert("Password changed");
    } catch (err) {
      const msg = err?.response?.data?.detail || err.message || "Error";
      alert(msg);
      throw new Error(msg);
    }
  }

  if (!user) return <div className="p-6">Loading profile...</div>;

  return (
    <div className="p-6">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-4 mb-4">
          <img
            src={user.avatar_url || "/assets/default-avatar.svg"}
            alt="avatar"
            className="w-20 h-20 rounded-full object-cover border"
          />
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-semibold">{user.name}</h2>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-300">{user.email}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Profile Info</h3>
            {editingName ? (
              <div className="flex gap-2">
                <input value={name} onChange={(e) => setName(e.target.value)} className="flex-1 border p-2 rounded" />
                <button onClick={saveName} className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
                <button onClick={() => { setEditingName(false); setName(user.name); }} className="px-3 py-1 border rounded">Cancel</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <div className="flex-1">
                  <div className="text-base">{user.name}</div>
                </div>
                <div>
                  <button onClick={() => setEditingName(true)} className="px-3 py-1 border rounded">Edit</button>
                </div>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Security</h3>
            <div className="flex flex-col gap-3">
              <label className="cursor-pointer text-sm text-blue-600 inline-flex items-center gap-2">
                <input type="file" onChange={handleAvatarChange} className="hidden" />
                Change photo
              </label>
              <button onClick={() => setPasswordModalOpen(true)} className="px-3 py-1 bg-green-600 text-white rounded">Change password</button>
            </div>
          </div>
        </div>
      </div>

      <PasswordModal open={passwordModalOpen} onClose={() => setPasswordModalOpen(false)} onSubmit={handlePasswordChange} />
    </div>
  );
}
