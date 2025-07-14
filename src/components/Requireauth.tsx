import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const [valid, setValid] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return setValid(false);
    axios.get("http://localhost:8000/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(() => setValid(true))
    .catch(() => setValid(false));
  }, []);

  if (valid === null) return <div>Loading...</div>;
  if (!valid) return <Navigate to="/login" replace />;
  return children;
}
