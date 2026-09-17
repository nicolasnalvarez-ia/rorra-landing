"use client";

import { useEffect } from "react";

export type ConfirmRequest = {
  title: string;
  message: string;
  /** Extra lines (e.g. where a photo is being used) shown as a list. */
  details?: string[];
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
};

export default function ConfirmModal({ request, onClose }: { request: ConfirmRequest; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="adm-modal-backdrop" onClick={onClose}>
      <div className="adm-modal adm-modal-sm" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="adm-modal-head">
          <div className="adm-modal-title">{request.title}</div>
          <button type="button" className="adm-modal-close" onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </div>

        <p className="adm-confirm-text">{request.message}</p>

        {request.details && request.details.length > 0 && (
          <ul className="adm-confirm-list">
            {request.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        )}

        <div className="adm-confirm-actions">
          <button type="button" className="adm-btn adm-btn-outline" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="button"
            className={`adm-btn ${request.danger ? "adm-btn-destructive" : "adm-btn-primary"}`}
            onClick={() => {
              request.onConfirm();
              onClose();
            }}
          >
            {request.confirmLabel ?? "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}
