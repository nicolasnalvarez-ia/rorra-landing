"use client";

import { useState } from "react";

export default function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (newPassword !== confirmPassword) {
      setError("La confirmación no coincide con la contraseña nueva.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "No se pudo cambiar la contraseña.");
        return;
      }
      setSuccess(true);
    } catch {
      setError("Error de conexión. Intentá de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="adm-modal-backdrop" onClick={onClose}>
      <div className="adm-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 380 }}>
        <div className="adm-modal-head">
          <div className="adm-modal-title">Cambiar contraseña</div>
          <button type="button" className="adm-modal-close" onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </div>

        {success ? (
          <>
            <p className="adm-section-desc" style={{ marginBottom: 18 }}>
              Listo, la contraseña se actualizó. Usá la nueva la próxima vez que inicies sesión.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button type="button" className="adm-btn adm-btn-primary" onClick={onClose}>
                Cerrar
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 600 }}>
              Contraseña actual
              <input
                type="password"
                className="adm-input"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoFocus
                required
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 600 }}>
              Contraseña nueva
              <input
                type="password"
                className="adm-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={6}
                required
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 600 }}>
              Repetir contraseña nueva
              <input
                type="password"
                className="adm-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={6}
                required
              />
            </label>
            {error && <div style={{ color: "#C4451C", fontSize: 13 }}>{error}</div>}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 6 }}>
              <button type="button" className="adm-btn adm-btn-outline" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="adm-btn adm-btn-primary" disabled={saving}>
                {saving ? "Guardando…" : "Guardar contraseña"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
