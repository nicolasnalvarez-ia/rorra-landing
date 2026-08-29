"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { StoredData } from "@/lib/content-store";
import type { LibraryItem, SiteContent } from "@/lib/content";
import { buildSlots } from "@/lib/slots";

type Status = { type: "idle" | "saving" | "saved" | "error"; message?: string };

export default function AdminDashboard({ initialData }: { initialData: StoredData }) {
  const router = useRouter();
  const [content, setContent] = useState<SiteContent>(initialData.content);
  const [library, setLibrary] = useState<LibraryItem[]>(initialData.library);
  const [pickerSlot, setPickerSlot] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const slots = useMemo(() => buildSlots(content), [content]);
  const sections = useMemo(() => {
    const bySection = new Map<string, typeof slots>();
    slots.forEach((s) => {
      const arr = bySection.get(s.section) ?? [];
      arr.push(s);
      bySection.set(s.section, arr);
    });
    return Array.from(bySection.entries());
  }, [slots]);

  async function persist(nextContent: SiteContent, nextLibrary: LibraryItem[]) {
    setStatus({ type: "saving" });
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: nextContent, library: nextLibrary }),
      });
      if (!res.ok) throw new Error("save failed");
      setStatus({ type: "saved", message: "Cambios guardados." });
    } catch {
      setStatus({ type: "error", message: "No se pudieron guardar los cambios." });
    }
  }

  function assignImage(slotKey: string, url: string) {
    const slot = slots.find((s) => s.key === slotKey);
    if (!slot) return;
    const next = slot.set(content, url);
    setContent(next);
    setPickerSlot(null);
    persist(next, library);
  }

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setStatus({ type: "idle" });
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "upload failed");
      const newItem: LibraryItem = { id: data.url, url: data.url, label: data.label };
      const nextLibrary = [newItem, ...library];
      setLibrary(nextLibrary);
      await persist(content, nextLibrary);
    } catch (err) {
      setStatus({ type: "error", message: err instanceof Error ? err.message : "Error al subir la imagen." });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F7F0E6", fontFamily: "Archivo, sans-serif", color: "#1E1812" }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 32px",
          borderBottom: "1px solid rgba(30,24,18,0.1)",
          position: "sticky",
          top: 0,
          background: "rgba(247,240,230,0.92)",
          backdropFilter: "blur(10px)",
          zIndex: 10,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 22 }}>
            Panel de admin <span style={{ color: "#C4451C" }}>·</span> Rocío Romero
          </div>
          <div style={{ fontSize: 13, color: "#6B5F52" }}>Elegí qué imagen aparece en cada parte de la landing.</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {status.type !== "idle" && (
            <span
              style={{
                fontSize: 13,
                color: status.type === "error" ? "#C4451C" : "#6B5F52",
              }}
            >
              {status.type === "saving" ? "Guardando…" : status.message}
            </span>
          )}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 13,
              fontWeight: 700,
              textDecoration: "underline",
              color: "#1E1812",
            }}
          >
            Ver landing ↗
          </a>
          <button
            onClick={logout}
            style={{
              border: "1.5px solid #1E1812",
              background: "transparent",
              borderRadius: 999,
              padding: "9px 18px",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 32px 80px" }}>
        <section
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: "24px 28px",
            marginBottom: 36,
            boxShadow: "0 12px 30px rgba(30,24,18,0.08)",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>Subir nueva imagen</div>
          <p style={{ fontSize: 13, color: "#6B5F52", margin: "0 0 14px" }}>
            Se agrega a tu biblioteca de fotos para poder usarla en cualquier parte de la landing. JPG, PNG,
            WEBP o GIF, hasta 8MB.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={onUpload}
            disabled={uploading}
          />
          {uploading && <span style={{ marginLeft: 12, fontSize: 13, color: "#6B5F52" }}>Subiendo…</span>}
        </section>

        {sections.map(([section, sectionSlots]) => (
          <section key={section} style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>{section}</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: 20,
              }}
            >
              {sectionSlots.map((slot) => (
                <div
                  key={slot.key}
                  style={{
                    background: "#fff",
                    borderRadius: 14,
                    overflow: "hidden",
                    boxShadow: "0 8px 24px rgba(30,24,18,0.08)",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={slot.get(content)}
                    alt={slot.label}
                    style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }}
                  />
                  <div style={{ padding: "12px 14px" }}>
                    <div style={{ fontSize: 13, marginBottom: 10, lineHeight: 1.4 }}>{slot.label}</div>
                    <button
                      onClick={() => setPickerSlot(slot.key)}
                      style={{
                        width: "100%",
                        background: "#1E1812",
                        color: "#F7F0E6",
                        border: "none",
                        borderRadius: 999,
                        padding: "9px 12px",
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Cambiar imagen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      {pickerSlot && (
        <ImagePicker
          library={library}
          currentUrl={slots.find((s) => s.key === pickerSlot)?.get(content) ?? ""}
          onSelect={(url) => assignImage(pickerSlot, url)}
          onClose={() => setPickerSlot(null)}
        />
      )}
    </div>
  );
}

function ImagePicker({
  library,
  currentUrl,
  onSelect,
  onClose,
}: {
  library: LibraryItem[];
  currentUrl: string;
  onSelect: (url: string) => void;
  onClose: () => void;
}) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(30,24,18,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#F7F0E6",
          borderRadius: 18,
          padding: 24,
          maxWidth: 760,
          width: "100%",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>Elegí una imagen</div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", lineHeight: 1 }}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: 12,
          }}
        >
          {library.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item.url)}
              style={{
                padding: 0,
                border: item.url === currentUrl ? "3px solid #C4451C" : "3px solid transparent",
                borderRadius: 10,
                overflow: "hidden",
                cursor: "pointer",
                background: "#fff",
              }}
              title={item.label}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.url}
                alt={item.label}
                style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block" }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
