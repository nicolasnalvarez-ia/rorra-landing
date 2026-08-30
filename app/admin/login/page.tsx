"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "No se pudo iniciar sesión.");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Error de conexión. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#F7F0E6",
        fontFamily: "Archivo, sans-serif",
        color: "#1E1812",
        padding: 24,
      }}
    >
      <form
        onSubmit={onSubmit}
        style={{
          background: "#fff",
          padding: "44px 40px",
          borderRadius: 16,
          boxShadow: "0 24px 60px rgba(30,24,18,0.14)",
          width: "100%",
          maxWidth: 380,
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 26,
              marginBottom: 4,
            }}
          >
            Rocío Romero<span style={{ color: "#C4451C" }}>.</span>
          </div>
          <div style={{ fontSize: 13, color: "#6B5F52" }}>Panel de administración</div>
        </div>
        <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 700 }}>
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            required
            style={{
              padding: "12px 14px",
              borderRadius: 10,
              border: "1.5px solid rgba(30,24,18,0.15)",
              fontSize: 15,
              fontFamily: "inherit",
            }}
          />
        </label>
        {error && <div style={{ color: "#C4451C", fontSize: 13 }}>{error}</div>}
        <button
          type="submit"
          disabled={loading}
          style={{
            background: "#1E1812",
            color: "#F7F0E6",
            border: "none",
            borderRadius: 999,
            padding: "13px 20px",
            fontSize: 14,
            fontWeight: 700,
            cursor: loading ? "default" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Ingresando…" : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
