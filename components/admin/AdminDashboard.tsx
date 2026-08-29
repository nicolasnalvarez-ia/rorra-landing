"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import CategoryCard from "@/components/admin/CategoryCard";
import FocalPointEditor from "@/components/admin/FocalPointEditor";
import ImagePicker from "@/components/admin/ImagePicker";
import UploadButton from "@/components/admin/UploadButton";
import type { StoredData } from "@/lib/content-store";
import { getFocal, type FocalPoint, type GaleriaItem, type LibraryItem, type SiteContent } from "@/lib/content";
import { buildSlots } from "@/lib/slots";

type Status = { type: "idle" | "saving" | "saved" | "error"; message?: string };
type Picker = { type: "slot"; key: string } | { type: "category"; id: string } | null;

function focalCss(library: LibraryItem[], url: string) {
  const { x, y } = getFocal(library, url);
  return `${x}% ${y}%`;
}

function newId() {
  return `g-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function AdminDashboard({ initialData }: { initialData: StoredData }) {
  const router = useRouter();
  const [content, setContent] = useState<SiteContent>(initialData.content);
  const [library, setLibraryState] = useState<LibraryItem[]>(initialData.library);
  // Kept in sync with `library` but updates synchronously, so a picker's "upload
  // then immediately select" flow can persist the freshly uploaded item instead
  // of a stale pre-upload snapshot from the same event handler.
  const libraryRef = useRef(initialData.library);
  function setLibrary(next: LibraryItem[]) {
    libraryRef.current = next;
    setLibraryState(next);
  }
  const [picker, setPicker] = useState<Picker>(null);
  const [focalItem, setFocalItem] = useState<LibraryItem | null>(null);
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [newCategoryTag, setNewCategoryTag] = useState("");

  const slots = useMemo(() => buildSlots(), []);

  async function persist(nextContent: SiteContent, nextLibrary: LibraryItem[]) {
    setStatus({ type: "saving" });
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: nextContent, library: nextLibrary }),
      });
      if (!res.ok) throw new Error("save failed");
      setStatus({ type: "saved", message: "Cambios guardados" });
    } catch {
      setStatus({ type: "error", message: "No se pudieron guardar los cambios" });
    }
  }

  function addToLibrary(item: LibraryItem) {
    const prev = libraryRef.current;
    setLibrary(prev.some((l) => l.url === item.url) ? prev : [item, ...prev]);
  }

  function assignSlot(slotKey: string, url: string) {
    const slot = slots.find((s) => s.key === slotKey);
    if (!slot) return;
    const next = slot.set(content, url);
    setContent(next);
    setPicker(null);
    persist(next, libraryRef.current);
  }

  function updateGaleria(updater: (galeria: GaleriaItem[]) => GaleriaItem[]) {
    const next = { ...content, galeria: updater(content.galeria) };
    setContent(next);
    persist(next, libraryRef.current);
    return next;
  }

  function renameCategory(id: string, tag: string) {
    updateGaleria((galeria) => galeria.map((g) => (g.id === id ? { ...g, tag } : g)));
  }

  function deleteCategory(id: string) {
    updateGaleria((galeria) => galeria.filter((g) => g.id !== id));
  }

  function addCategory() {
    const tag = newCategoryTag.trim();
    if (!tag) return;
    updateGaleria((galeria) => [...galeria, { id: newId(), tag, photos: [] }]);
    setNewCategoryTag("");
  }

  function removePhoto(categoryId: string, index: number) {
    updateGaleria((galeria) =>
      galeria.map((g) => (g.id === categoryId ? { ...g, photos: g.photos.filter((_, i) => i !== index) } : g))
    );
  }

  function addPhotoToCategory(categoryId: string, url: string) {
    const next = {
      ...content,
      galeria: content.galeria.map((g) => (g.id === categoryId ? { ...g, photos: [...g.photos, url] } : g)),
    };
    setContent(next);
    setPicker(null);
    persist(next, libraryRef.current);
  }

  function onPickerUploaded(item: LibraryItem) {
    addToLibrary(item);
  }

  function saveFocal(id: string, focal: FocalPoint) {
    const nextLibrary = libraryRef.current.map((l) => (l.id === id ? { ...l, focal } : l));
    setLibrary(nextLibrary);
    setFocalItem(null);
    persist(content, nextLibrary);
  }

  function findUsages(url: string): string[] {
    const usages: string[] = [];
    if (content.hero.image1 === url) usages.push("Hero, foto 1");
    if (content.hero.image2 === url) usages.push("Hero, foto 2");
    if (content.sobreMi.image === url) usages.push("Sobre mí");
    content.galeria.forEach((g) => {
      if (g.photos.includes(url)) usages.push(`Portfolio · ${g.tag}`);
    });
    return usages;
  }

  function deleteFromLibrary(item: LibraryItem) {
    const usages = findUsages(item.url);
    const question =
      usages.length > 0
        ? `Esta foto se está usando en: ${usages.join(", ")}. Si la sacás de la biblioteca vas a dejar de poder elegirla para nuevos lugares, pero va a seguir viéndose donde ya está puesta. ¿Sacarla igual?`
        : "¿Sacar esta foto de la biblioteca?";
    if (!window.confirm(question)) return;
    const nextLibrary = libraryRef.current.filter((l) => l.id !== item.id);
    setLibrary(nextLibrary);
    persist(content, nextLibrary);
  }

  function onError(message: string) {
    setStatus({ type: "error", message });
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const pickerCategory = picker?.type === "category" ? content.galeria.find((g) => g.id === picker.id) : null;
  const pickerSlotDef = picker?.type === "slot" ? slots.find((s) => s.key === picker.key) : null;

  return (
    <div className="adm">
      <header className="adm-header">
        <div>
          <div className="adm-title">
            Panel de admin <span style={{ color: "#C4451C" }}>·</span> Rocío Romero
          </div>
          <div className="adm-subtitle">Elegí las imágenes y organizá las categorías del portfolio.</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {status.type !== "idle" && (
            <span className="adm-status">
              <span className={`adm-status-dot${status.type === "saving" ? " is-saving" : ""}${status.type === "error" ? " is-error" : ""}`} />
              {status.type === "saving" ? "Guardando…" : status.message}
            </span>
          )}
          <a href="/" target="_blank" rel="noopener noreferrer" className="adm-btn adm-btn-ghost">
            Ver landing ↗
          </a>
          <button onClick={logout} className="adm-btn adm-btn-outline">
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="adm-main">
        {/* HERO / SOBRE MI SLOTS */}
        {["Hero", "Sobre mí"].map((section) => (
          <div className="adm-section" key={section}>
            <div className="adm-section-head">
              <div className="adm-section-title">{section}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 18 }}>
              {slots
                .filter((s) => s.section === section)
                .map((slot) => (
                  <div key={slot.key} className="adm-slot-card">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={slot.get(content)}
                      alt={slot.label}
                      className="adm-slot-img"
                      style={{ objectPosition: focalCss(library, slot.get(content)) }}
                    />
                    <div className="adm-slot-body">
                      <div className="adm-slot-label">{slot.label}</div>
                      <button
                        className="adm-btn adm-btn-primary"
                        onClick={() => setPicker({ type: "slot", key: slot.key })}
                      >
                        Cambiar imagen
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}

        {/* PORTFOLIO CATEGORIES */}
        <div className="adm-section">
          <div className="adm-section-head">
            <div>
              <div className="adm-section-title">Portfolio</div>
              <p className="adm-section-desc">
                Cada categoría aparece como una tarjeta en el portfolio. Podés agregar, renombrar o eliminar
                categorías, y sumar o quitar fotos dentro de cada una.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {content.galeria.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                library={library}
                onRename={(tag) => renameCategory(cat.id, tag)}
                onDelete={() => deleteCategory(cat.id)}
                onRemovePhoto={(i) => removePhoto(cat.id, i)}
                onAddPhoto={() => setPicker({ type: "category", id: cat.id })}
              />
            ))}

            <div className="adm-new-cat">
              <input
                className="adm-input"
                placeholder="Nombre de la nueva categoría (ej: viajes)"
                value={newCategoryTag}
                onChange={(e) => setNewCategoryTag(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCategory()}
                style={{ flex: 1, minWidth: 200 }}
              />
              <button className="adm-btn adm-btn-primary" onClick={addCategory} disabled={!newCategoryTag.trim()}>
                ＋ Nueva categoría
              </button>
            </div>
          </div>
        </div>

        {/* PHOTO LIBRARY */}
        <div className="adm-section">
          <div className="adm-section-head">
            <div>
              <div className="adm-section-title">Biblioteca de fotos</div>
              <p className="adm-section-desc">
                Subí fotos nuevas acá para tenerlas disponibles en cualquier parte de la landing. JPG, PNG,
                WEBP o GIF, hasta 8MB.
              </p>
            </div>
            <UploadButton
              label="＋ Subir foto"
              className="adm-btn adm-btn-primary"
              onUploaded={(item) => addToLibrary(item)}
              onError={onError}
            />
          </div>
          <div className="adm-cat-photos">
            {library.map((item) => (
              <div className="adm-photo-tile adm-lib-tile" key={item.id} title={item.label}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt={item.label} style={{ objectPosition: focalCss(library, item.url) }} />
                <button
                  type="button"
                  className="adm-focal-btn"
                  onClick={() => setFocalItem(item)}
                  aria-label="Ajustar encuadre"
                  title="Ajustar encuadre"
                >
                  ⤢
                </button>
                <button
                  type="button"
                  className="adm-photo-remove"
                  onClick={() => deleteFromLibrary(item)}
                  aria-label="Sacar de la biblioteca"
                  title="Sacar de la biblioteca"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {picker?.type === "slot" && pickerSlotDef && (
        <ImagePicker
          title={`Elegí: ${pickerSlotDef.label}`}
          library={library}
          currentUrl={pickerSlotDef.get(content)}
          onSelect={(url) => assignSlot(picker.key, url)}
          onClose={() => setPicker(null)}
          onUploaded={onPickerUploaded}
          onError={onError}
        />
      )}

      {picker?.type === "category" && pickerCategory && (
        <ImagePicker
          title={`Agregar foto a "${pickerCategory.tag}"`}
          library={library}
          onSelect={(url) => addPhotoToCategory(picker.id, url)}
          onClose={() => setPicker(null)}
          onUploaded={onPickerUploaded}
          onError={onError}
        />
      )}

      {focalItem && (
        <FocalPointEditor
          item={focalItem}
          onSave={(focal) => saveFocal(focalItem.id, focal)}
          onClose={() => setFocalItem(null)}
        />
      )}
    </div>
  );
}
