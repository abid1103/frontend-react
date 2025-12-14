// src/components/Layout.jsx
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  TrendingUp,
  MessageCircle,
  LineChart,
  Menu,
  X,
} from "lucide-react";
import { apiLogout, apiGetProfile } from "../api";
import defaultAvatar from "../assets/default-avatar.svg";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const ddRef = useRef(null);

  /* Load profile (UNCHANGED) */
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await apiGetProfile();
        if (mounted) setUser(res.data);
      } catch {
        if (mounted) setUser(null);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  /* Dropdown outside click (UNCHANGED) */
  useEffect(() => {
    function onDocClick(e) {
      if (ddRef.current && !ddRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard /> },
    { name: "Trends", path: "/trends", icon: <TrendingUp /> },
    { name: "Sentiment", path: "/sentiment", icon: <MessageCircle /> },
    { name: "Forecast", path: "/forecast", icon: <LineChart /> },
  ];

  async function handleLogout() {
    try {
      await apiLogout(); // clears cookie on server
    } catch (err) {
      // ignore errors
    }
    window.location.href = "/";
  }

  return (
    <div className="flex min-h-screen w-full">

      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 70 : 250 }}
        transition={{ duration: 0.25 }}
        className="flex-shrink-0 flex flex-col h-screen sticky top-0"
        style={{
          minWidth: collapsed ? 70 : 250, // ✅ KEY FIX
          background: "var(--sidebar-bg, #1e293b)",
          color: "var(--text-sidebar, #e6eef8)",
        }}
      >
        <div
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: "rgba(255,255,255,0.04)" }}
        >
          {!collapsed && (
            <h1 className="text-xl font-bold">BrandInsight</h1>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-md"
          >
            {collapsed ? <Menu /> : <X />}
          </button>
        </div>

        <nav className="mt-4 flex flex-col gap-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.name} to={item.path}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="flex items-center gap-3 p-3 mx-3 rounded-xl"
                  style={{
                    background: active
                      ? "var(--accent, #2563eb)"
                      : "transparent",
                    color: "white",
                  }}
                >
                  {item.icon}
                  {!collapsed && (
                    <span className="font-medium">{item.name}</span>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-lg"
            style={{ color: "var(--text-sidebar, #e6eef8)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="opacity-80">
              <path d="M16 17l5-5-5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13 19H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Right column */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Navbar (location UNCHANGED, state LINKED) */}
        <header
          className="flex items-center justify-end p-3"
          style={{
            background: "var(--sidebar-bg, #1e293b)",
            color: "var(--text-sidebar, #e6eef8)",
          }}
        >


          {/* Profile dropdown (UNCHANGED) */}
          <div className="relative" ref={ddRef}>
            <button
              onClick={() => setOpen((s) => !s)}
              className="flex items-center gap-3 p-1 rounded-md"
            >
              <img
                src={user?.avatar_url || defaultAvatar}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-medium">
                {user?.name || "testt"}
              </span>
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-50 overflow-hidden bg-white dark:bg-gray-800">
                <div
                  className="px-4 py-2 cursor-pointer text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                  onClick={() => {
                    navigate("/settings");
                    setOpen(false);
                  }}
                >
                  Settings
                </div>
                <div
                  className="px-4 py-2 cursor-pointer text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                  onClick={() => {
                    navigate("/profile");
                    setOpen(false);
                  }}
                >
                  Profile
                </div>
                <div className="border-t" />
                  <div
                    className="px-4 py-2 cursor-pointer text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={handleLogout}
                  >
                    Logout
                  </div>
              </div>
            )}
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-6 bg-[var(--bg-app,#f3f4f6)]">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
