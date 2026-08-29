"use client";

import UploadButton from "@/components/admin/UploadButton";
import type { LibraryItem } from "@/lib/content";

export default function ImagePicker({
  title,
  library,
  onPick,
  onClose,
  onUploaded,
  onError,
}: {
  title: string;
  library: LibraryItem[];
  onPick: (url: string) => void;
  onClose: () => void;
  onUploaded: (item: LibraryItem) => void;
  onError: (message: string) => void;
}) {
  return (
    <div className="adm-modal-backdrop" onClick={onClose}>
      <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="adm-modal-head">
          <div className="adm-modal-title">{title}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <UploadButton
              label="＋ Subir nueva"
              onError={onError}
              onUploaded={(item) => {
                onUploaded(item);
                onPick(item.url);
              }}
            />
            <button type="button" className="adm-modal-close" onClick={onClose} aria-label="Cerrar">
              ×
            </button>
          </div>
        </div>
        <div className="adm-picker-grid">
          {library.map((item) => (
            <button
              key={item.id}
              type="button"
              className="adm-picker-item"
              onClick={() => onPick(item.url)}
              title={item.label}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt={item.label} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
