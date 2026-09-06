"use client";

import { useRef, useState } from "react";

/**
 * A2 photo uploader — spec/screens/shared/S-04-photo-uploader.md. Tap to
 * choose (camera opens directly on mobile), drag and drop on desktop.
 * Thumbnails show immediately from the local file with a progress ring
 * while the upload runs; tap to enlarge, X to remove. Errors show on the
 * thumbnail itself, never as a popup.
 *
 * Upload itself is caller-provided (`onUpload`) — this component only
 * owns the local preview/progress/error UI, not transport or compression.
 */
export interface PhotoUploaderPhoto {
  id: string;
  previewUrl: string;
  progress: number | "done";
  error?: string;
}

interface PhotoUploaderProps {
  label: string;
  maxPhotos: number;
  photos: PhotoUploaderPhoto[];
  onFilesSelected: (files: File[]) => void;
  onRemove: (id: string) => void;
  onEnlarge: (id: string) => void;
}

export function PhotoUploader({
  label,
  maxPhotos,
  photos,
  onFilesSelected,
  onRemove,
  onEnlarge,
}: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const atLimit = photos.length >= maxPhotos;

  return (
    <div className="flex flex-col gap-2">
      <span className="type-label text-muted">
        {label} ({photos.length}/{maxPhotos})
      </span>
      <div className="flex flex-wrap gap-3">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="relative h-20 w-20 overflow-hidden rounded-sm border border-line bg-canvas"
          >
            <button
              type="button"
              onClick={() => onEnlarge(photo.id)}
              className="block h-full w-full"
              aria-label="Enlarge photo"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview, not an optimizable remote asset */}
              <img
                src={photo.previewUrl}
                alt="Uploaded photo"
                className="h-full w-full object-cover"
              />
            </button>
            {photo.progress !== "done" && !photo.error && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-ink/40"
                aria-label={`Uploading, ${photo.progress}%`}
              >
                <span
                  aria-hidden="true"
                  className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent"
                />
              </div>
            )}
            {photo.error && (
              <p className="absolute inset-x-0 bottom-0 bg-danger/90 px-1 py-0.5 type-small text-white">
                {photo.error}
              </p>
            )}
            <button
              type="button"
              onClick={() => onRemove(photo.id)}
              aria-label="Remove photo"
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink/70 type-small text-white"
            >
              ×
            </button>
          </div>
        ))}
        {!atLimit && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(event) => {
              event.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragOver(false);
              onFilesSelected(Array.from(event.dataTransfer.files));
            }}
            className={[
              "flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-sm border border-dashed type-small text-muted transition-colors",
              dragOver ? "border-primary bg-primary-soft" : "border-line hover:bg-canvas",
            ].join(" ")}
          >
            <span aria-hidden="true" className="text-lg">
              +
            </span>
            Add photo
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        className="hidden"
        onChange={(event) => {
          if (event.target.files) {
            onFilesSelected(Array.from(event.target.files));
            event.target.value = "";
          }
        }}
      />
    </div>
  );
}
