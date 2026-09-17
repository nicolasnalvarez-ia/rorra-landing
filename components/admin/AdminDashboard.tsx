"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import CategoryCard from "@/components/admin/CategoryCard";
import ChangePasswordModal from "@/components/admin/ChangePasswordModal";
import ConfirmModal, { type ConfirmRequest } from "@/components/admin/ConfirmModal";
import CropStep from "@/components/admin/CropStep";
import ImagePicker from "@/components/admin/ImagePicker";
import PhotoViewer from "@/components/admin/PhotoViewer";
import UploadZone from "@/components/admin/UploadZone";
import CroppedImage from "@/components/CroppedImage";
import type { StoredData } from "@/lib/content-store";
import {
  DEFAULT_FOCAL,
  croppedPhoto,
  type CroppedPhoto,
  type FocalPoint,
  type GaleriaItem,
  type LibraryItem,
  type SiteContent,
} from "@/lib/content";
import { buildSlots } from "@/lib/slots";
import type { StorageStatus } from "@/lib/supabase-storage";
import { findUsages } from "@/lib/usages";

type Status = { type: "idle" | "saving" | "saved" | "error"; message?: string };

// Two things ask for a photo pick: a single-image slot (hero/sobre mí) or
// adding a new photo to a portfolio category.
type PickTarget = { type: "slot"; key: string } | { type: "category"; id: string };

// After a pick (or when re-editing an existing photo's crop), this holds
// what to crop and what to do with the result.
type CropTarget = { url: string; initialFocal: FocalPoint; onConfirm: (photo: CroppedPhoto) => void };

function move<T>(items: T[], index: number, direction: -1 | 1): T[] {
  const target = index + direction;
  if (target < 0 || target >= items.length) return items;
  const next = [...items];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export default function AdminDashboard({
  initialData,
  storage,
}: {
  initialData: StoredData;
  storage: StorageStatus;
}) {
  const router = useRouter();
  const [content, setContent] = useState<SiteContent>(initialData.content);
  const [library, setLibraryState] = useState<LibraryItem[]>(initialData.library);
  // Kept in sync with `library` but updates synchronously, so a picker's "upload
  // then immediately pick" flow can persist the freshly uploaded item instead
  // of a stale pre-upload snapshot from the same event handler.
  const libraryRef = useRef(initialData.library);
  function setLibrary(next: LibraryItem[]) {
    libraryRef.current = next;
    setLibraryState(next);
  }
  const [pickTarget, setPickTarget] = useState<PickTarget | null>(null);
  const [cropTarget, setCropTarget] = useState<CropTarget | null>(null);
  const [confirmRequest, setConfirmRequest] = useState<ConfirmRequest | null>(null);
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [newCategoryTag, setNewCategoryTag] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  // Tracked by URL, not index, so deleting a photo closes the viewer instead of
  // silently sliding the next one into its place.
  const [viewerUrl, setViewerUrl] = useState<string | null>(null);

  const slots = useMemo(() => buildSlots(), []);

  // How many places each photo appears, for the library's "en uso" badges.
  const usageCounts = useMemo(() => {
    const counts = new Map<string, number>();
    const bump = (url: string) => counts.set(url, (counts.get(url) ?? 0) + 1);
    bump(content.hero.image1.url);
    bump(content.hero.image2.url);
    bump(content.sobreMi.image.url);
    content.galeria.forEach((cat) => cat.photos.forEach((p) => bump(p.url)));
    return counts;
  }, [content]);

  const viewerIndex = viewerUrl ? library.findIndex((l) => l.url === viewerUrl) : -1;

  async function persist(nextContent: SiteContent, nextLibrary: LibraryItem[]) {
    setStatus({ type: "saving" });
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: nextContent, library: nextLibrary }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "No se pudieron guardar los cambios");
      setStatus({ type: "saved", message: "Cambios guardados" });
    } catch (err) {
      setStatus({
        type: "error",
        message: err instanceof Error ? err.message : "No se pudieron guardar los cambios",
      });
    }
  }

  function addToLibrary(item: LibraryItem) {
    const prev = libraryRef.current;
    if (prev.some((l) => l.url === item.url)) return;
    const next = [item, ...prev];
    setLibrary(next);
    persist(content, next);
  }

  function assignSlot(slotKey: string, photo: CroppedPhoto) {
    const slot = slots.find((s) => s.key === slotKey);
    if (!slot) return;
    const next = slot.set(content, photo);
    setContent(next);
    persist(next, libraryRef.current);
  }

  function updateGaleria(updater: (galeria: GaleriaItem[]) => GaleriaItem[]) {
    const next = { ...content, galeria: updater(content.galeria) };
    setContent(next);
    persist(next, libraryRef.current);
  }

  function renameCategory(id: string, tag: string) {
    updateGaleria((galeria) => galeria.map((g) => (g.id === id ? { ...g, tag } : g)));
  }

  function deleteCategory(category: GaleriaItem) {
    setConfirmRequest({
      title: "Eliminar categoría",
      message: `Se va a sacar "${category.tag}" del portfolio. Las fotos siguen en la biblioteca.`,
      confirmLabel: "Eliminar",
      danger: true,
      onConfirm: () => updateGaleria((galeria) => galeria.filter((g) => g.id !== category.id)),
    });
  }

  function addCategory() {
    const tag = newCategoryTag.trim();
    if (!tag) return;
    if (content.galeria.some((g) => g.tag.toLowerCase() === tag.toLowerCase())) {
      setStatus({ type: "error", message: `Ya existe una categoría llamada "${tag}".` });
      return;
    }
    updateGaleria((galeria) => [...galeria, { id: newId(), tag, photos: [] }]);
    setNewCategoryTag("");
  }

  function removePhoto(categoryId: string, index: number) {
    updateGaleria((galeria) =>
      galeria.map((g) => (g.id === categoryId ? { ...g, photos: g.photos.filter((_, i) => i !== index) } : g))
    );
  }

  function movePhoto(categoryId: string, index: number, direction: -1 | 1) {
    updateGaleria((galeria) =>
      galeria.map((g) => (g.id === categoryId ? { ...g, photos: move(g.photos, index, direction) } : g))
    );
  }

  function moveCategory(index: number, direction: -1 | 1) {
    updateGaleria((galeria) => move(galeria, index, direction));
  }

  function addPhotoToCategory(categoryId: string, photo: CroppedPhoto) {
    updateGaleria((galeria) =>
      galeria.map((g) =>
        g.id === categoryId && !g.photos.some((p) => p.url === photo.url)
          ? { ...g, photos: [...g.photos, photo] }
          : g
      )
    );
  }

  function updateCategoryPhotoFocal(categoryId: string, index: number, focal: FocalPoint) {
    updateGaleria((galeria) =>
      galeria.map((g) =>
        g.id === categoryId
          ? { ...g, photos: g.photos.map((p, i) => (i === index ? { ...p, focal } : p)) }
          : g
      )
    );
  }

  function onError(message: string) {
    setStatus({ type: "error", message });
  }

  // A photo was picked (existing library item or a fresh upload) for `pickTarget`.
  // Always route through a crop step before it actually gets assigned/added.
  function onPicked(url: string) {
    if (!pickTarget) return;
    const target = pickTarget;
    setPickTarget(null);
    const initialFocal =
      target.type === "slot"
        ? slots.find((s) => s.key === target.key)?.get(content).focal ?? DEFAULT_FOCAL
        : DEFAULT_FOCAL;
    setCropTarget({
      url,
      initialFocal,
      onConfirm: (photo) => {
        if (target.type === "slot") assignSlot(target.key, photo);
        else addPhotoToCategory(target.id, photo);
      },
    });
  }

  /** Deletes for real: storage object, library entry, and any portfolio use. */
  async function deletePhoto(item: LibraryItem, force: boolean) {
    setStatus({ type: "saving" });
    try {
      const res = await fetch("/api/admin/photos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: item.url, force }),
      });
      const data = await res.json().catch(() => null);

      if (res.status === 409 && data?.needsConfirmation) {
        setStatus({ type: "idle" });
        setConfirmRequest({
          title: "La foto está en uso",
          message: `"${item.label}" se está mostrando en el portfolio. Si la borrás, también se saca de ahí.`,
          details: data.usages,
          confirmLabel: "Borrar igual",
          danger: true,
          onConfirm: () => deletePhoto(item, true),
        });
        return;
      }

      if (!res.ok) throw new Error(data?.error || "No se pudo borrar la foto.");

      setContent(data.content);
      setLibrary(data.library);
      setStatus({ type: "saved", message: "Foto eliminada" });
    } catch (err) {
      setStatus({ type: "error", message: err instanceof Error ? err.message : "No se pudo borrar la foto." });
    }
  }

  function confirmDelete(item: LibraryItem) {
    const usages = findUsages(content, item.url).map((u) => u.label);
    setConfirmRequest({
      title: item.builtin ? "Sacar de la biblioteca" : "Borrar foto",
      message: item.builtin
        ? `"${item.label}" viene incluida con el sitio: se saca de la biblioteca pero el archivo no se borra.`
        : `"${item.label}" se va a borrar definitivamente del almacenamiento. No se puede deshacer.`,
      details: usages.length > 0 ? usages : undefined,
      confirmLabel: item.builtin ? "Sacar" : "Borrar",
      danger: true,
      onConfirm: () => deletePhoto(item, false),
    });
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  // When storage itself is down the banner above already says why; repeating
  // the same text as a save failure is just noise.
  const storageMessage = storage.ok ? null : storage.message;

  const pickerCategory = pickTarget?.type === "category" ? content.galeria.find((g) => g.id === pickTarget.id) : null;
  const pickerSlotDef = pickTarget?.type === "slot" ? slots.find((s) => s.key === pickTarget.key) : null;

  return (
    <div className="adm">
      <header className="adm-header">
        <div>
          <div className="adm-title">
            Panel de admin <span style={{ color: "#C4451C" }}>·</span> Rocío Romero
          </div>
          <div className="adm-subtitle">Elegí las imágenes y organizá las categorías del portfolio.</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          {status.type !== "idle" && (
            <span className="adm-status">
              <span
                className={`adm-status-dot${status.type === "saving" ? " is-saving" : ""}${
                  status.type === "error" ? " is-error" : ""
                }`}
              />
              {status.type === "saving" ? "Guardando…" : status.type === "error" ? "Error" : status.message}
            </span>
          )}
          <a href="/" target="_blank" rel="noopener noreferrer" className="adm-btn adm-btn-ghost">
            Ver landing ↗
          </a>
          <button className="adm-btn adm-btn-ghost" onClick={() => setChangingPassword(true)}>
            Cambiar contraseña
          </button>
          <button onClick={logout} className="adm-btn adm-btn-outline">
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="adm-main">
        {!storage.ok && (
          <div className="adm-banner" role="alert">
            <strong>Los cambios no se van a guardar.</strong>
            <span>{storage.message}</span>
          </div>
        )}

        {status.type === "error" && status.message && status.message !== storageMessage && (
          <div className="adm-banner" role="alert">
            <strong>Algo falló.</strong>
            <span>{status.message}</span>
          </div>
        )}

        {/* HERO / SOBRE MI SLOTS */}
        {["Hero", "Sobre mí"].map((section) => (
          <div className="adm-section" key={section}>
            <div className="adm-section-head">
              <div className="adm-section-title">{section}</div>
            </div>
            <div className="adm-slot-grid">
              {slots
                .filter((s) => s.section === section)
                .map((slot) => {
                  const photo = slot.get(content);
                  return (
                    <div key={slot.key} className="adm-slot-card">
                      <CroppedImage photo={photo} alt={slot.label} className="adm-slot-img" />
                      <div className="adm-slot-body">
                        <div className="adm-slot-name">{slot.label}</div>
                        <div className="adm-slot-label">{slot.hint}</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          <button
                            className="adm-btn adm-btn-primary"
                            onClick={() => setPickTarget({ type: "slot", key: slot.key })}
                          >
                            Cambiar imagen
                          </button>
                          <button
                            className="adm-btn adm-btn-outline"
                            onClick={() =>
                              setCropTarget({
                                url: photo.url,
                                initialFocal: photo.focal,
                                onConfirm: (p) => assignSlot(slot.key, p),
                              })
                            }
                          >
                            Ajustar encuadre
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}

        {/* PORTFOLIO CATEGORIES */}
        <div className="adm-section">
          <div className="adm-section-head">
            <div>
              <div className="adm-section-title">Portfolio</div>
              <p className="adm-section-desc">
                Cada categoría es una tarjeta del portfolio, en este mismo orden. La primera foto de cada una
                es la portada que se ve en la grilla; el resto aparece al abrirla.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {content.galeria.map((cat, index) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                canMoveUp={index > 0}
                canMoveDown={index < content.galeria.length - 1}
                onRename={(tag) => renameCategory(cat.id, tag)}
                onDelete={() => deleteCategory(cat)}
                onRemovePhoto={(i) => removePhoto(cat.id, i)}
                onEditCrop={(i) =>
                  setCropTarget({
                    url: cat.photos[i].url,
                    initialFocal: cat.photos[i].focal,
                    onConfirm: (focalPhoto) => updateCategoryPhotoFocal(cat.id, i, focalPhoto.focal),
                  })
                }
                onAddPhoto={() => setPickTarget({ type: "category", id: cat.id })}
                onMovePhoto={(i, direction) => movePhoto(cat.id, i, direction)}
                onMoveCategory={(direction) => moveCategory(index, direction)}
              />
            ))}

            <div className="adm-new-cat">
              <input
                className="adm-input"
                placeholder="Nombre de la nueva categoría (ej: viajes)"
                value={newCategoryTag}
                onChange={(e) => setNewCategoryTag(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCategory()}
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
                Todo lo que subas queda disponible para el Hero, Sobre mí y el portfolio. Las fotos se
                optimizan solas antes de subirse, y si subís una que ya estaba no se duplica.
              </p>
            </div>
            <span className="adm-lib-count">
              {library.length} {library.length === 1 ? "foto" : "fotos"}
            </span>
          </div>

          <UploadZone onUploaded={addToLibrary} isKnown={(url) => libraryRef.current.some((l) => l.url === url)} />

          <div className="adm-lib-grid">
            {library.map((item) => {
              const uses = usageCounts.get(item.url) ?? 0;
              return (
                <div className="adm-lib-card" key={item.id}>
                  <div className="adm-photo-tile adm-lib-tile">
                    <button
                      type="button"
                      className="adm-tile-open"
                      onClick={() => setViewerUrl(item.url)}
                      aria-label={`Ver "${item.label}" en grande`}
                      title="Ver en grande"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.url} alt={item.label} />
                    </button>
                    <button
                      type="button"
                      className="adm-photo-remove"
                      onClick={() => confirmDelete(item)}
                      aria-label={item.builtin ? "Sacar de la biblioteca" : "Borrar foto"}
                      title={item.builtin ? "Sacar de la biblioteca" : "Borrar foto"}
                    >
                      ×
                    </button>
                  </div>
                  <div className="adm-lib-meta">
                    <span className="adm-lib-label" title={item.label}>
                      {item.label}
                    </span>
                    <span className={`adm-lib-uses${uses === 0 ? " is-unused" : ""}`}>
                      {uses === 0 ? "sin usar" : `en uso · ${uses}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {viewerIndex >= 0 && (
        <PhotoViewer
          items={library}
          index={viewerIndex}
          uses={usageCounts.get(library[viewerIndex].url) ?? 0}
          onIndex={(next) => setViewerUrl(library[next].url)}
          onClose={() => setViewerUrl(null)}
        />
      )}

      {pickTarget?.type === "slot" && pickerSlotDef && (
        <ImagePicker
          title={`Elegí: ${pickerSlotDef.label}`}
          library={library}
          onPick={onPicked}
          onClose={() => setPickTarget(null)}
          onUploaded={addToLibrary}
          onError={onError}
        />
      )}

      {pickTarget?.type === "category" && pickerCategory && (
        <ImagePicker
          title={`Agregar foto a "${pickerCategory.tag}"`}
          library={library}
          alreadyUsedUrls={pickerCategory.photos.map((p) => p.url)}
          onPick={onPicked}
          onClose={() => setPickTarget(null)}
          onUploaded={addToLibrary}
          onError={onError}
        />
      )}

      {cropTarget && (
        <CropStep
          url={cropTarget.url}
          initialFocal={cropTarget.initialFocal}
          onConfirm={(focal) => {
            cropTarget.onConfirm(croppedPhoto(cropTarget.url, focal));
            setCropTarget(null);
          }}
          onClose={() => setCropTarget(null)}
        />
      )}

      {confirmRequest && <ConfirmModal request={confirmRequest} onClose={() => setConfirmRequest(null)} />}

      {changingPassword && <ChangePasswordModal onClose={() => setChangingPassword(false)} />}
    </div>
  );
}

function newId() {
  return `g-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
