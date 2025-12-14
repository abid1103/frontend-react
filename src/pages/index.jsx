// In frontend src/pages/index.jsx or index.tsx
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    window.location.href = "https://backend-fastapi-mz7v.onrender.com";
  }, []);
  return <div>Redirecting...</div>;
}
