"use client";

import { useRef, useState } from "react";
import type { LibraryItem } from "@/lib/content";
import { formatBytes } from "@/lib/image-compress";
import { ACCEPTED_TYPES, uploadPhoto } from "@/lib/upload-client";

type JobStatus = "pending" | "working" | "done" | "duplicate" | "error";
type Job = { id: number; name: string; status: JobStatus; detail?: string };

let jobCounter = 0;

/**
 * Drag-and-drop (or click) upload for several photos at once. Each file is
 * compressed in the browser and then uploaded; the server dedupes by content
 * hash, so re-adding a photo reports "ya estaba" instead of storing it twice.
 */
export default function UploadZone({
  onUploaded,
  isKnown,
}: {
  onUploaded: (item: LibraryItem) => void;
  /** Already in the library — lets a repeat upload be reported without a second trip. */
  isKnown: (url: string) => boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);

  function updateJob(id: number, patch: Partial<Job>) {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, ...patch } : j)));
  }

  async function handleFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    const queued: Job[] = files.map((file) => ({ id: ++jobCounter, name: file.name, status: "pending" }));
    setJobs((prev) => [...queued, ...prev].slice(0, 12));
    setBusy(true);

    // Sequential on purpose: several 8MB phone photos compressing and
    // uploading at once can stall a phone browser.
    for (let i = 0; i < files.length; i++) {
      const job = queued[i];
      updateJob(job.id, { status: "working", detail: "Optimizando…" });
      try {
        const result = await uploadPhoto(files[i]);
        const alreadyInLibrary = result.duplicate || isKnown(result.item.url);
        onUploaded(result.item);
        updateJob(job.id, {
          status: alreadyInLibrary ? "duplicate" : "done",
          detail: alreadyInLibrary
            ? "Ya estaba en la biblioteca"
            : result.size < result.originalSize
              ? `${formatBytes(result.originalSize)} → ${formatBytes(result.size)}`
              : formatBytes(result.size),
        });
      } catch (err) {
        updateJob(job.id, {
          status: "error",
          detail: err instanceof Error ? err.message : "No se pudo subir.",
        });
      }
    }

    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="adm-uploader">
      <div
        className={`adm-dropzone${dragging ? " is-dragging" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED_TYPES.join(",")}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          disabled={busy}
          aria-label="Subir fotos"
        />
        <div className="adm-dropzone-text">
          <strong>{busy ? "Subiendo…" : "Arrastrá tus fotos acá"}</strong>
          <span>o hacé clic para elegirlas. JPG, PNG, WEBP o GIF.</span>
        </div>
      </div>

      {jobs.length > 0 && (
        <ul className="adm-joblist">
          {jobs.map((job) => (
            <li key={job.id} className={`adm-job is-${job.status}`}>
              <span className="adm-job-icon" aria-hidden="true">
                {job.status === "done" ? "✓" : job.status === "duplicate" ? "≡" : job.status === "error" ? "!" : "•"}
              </span>
              <span className="adm-job-name">{job.name}</span>
              <span className="adm-job-detail">{job.detail}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
