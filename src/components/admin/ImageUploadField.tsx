"use client";

import { useRef, useState } from "react";

import { useAdminImageUpload } from "@/components/admin/useAdminImageUpload";
import { sanitizeStoredImageUrl } from "@/lib/sanitize-image-url";

type ImageUploadFieldProps = {
  defaultValue?: string;
  hiddenInputName?: string;
  fieldId: string;
  helpText?: string;
};

export function ImageUploadField({
  defaultValue = "",
  hiddenInputName = "value",
  fieldId,
  helpText = "Drag and drop an image, or click to choose a file. JPEG, PNG, WebP, or GIF up to 8 MB. Requires Cloudinary, Google Cloud Storage, or S3/R2 in production (see .env.example).",
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(defaultValue.trim());
  const [dragOver, setDragOver] = useState(false);
  const { uploadFiles, uploading, error, clearError } = useAdminImageUpload();

  async function handleFiles(files: FileList | File[] | null) {
    if (!files?.length || uploading) return;
    clearError();
    const uploaded = await uploadFiles(files);
    if (uploaded[0]) {
      setUrl(uploaded[0]);
    }
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name={hiddenInputName} value={url} />
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          void handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={[
          "flex min-h-[10rem] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 text-center transition",
          dragOver
            ? "border-zinc-900 bg-zinc-100"
            : "border-zinc-300 bg-white hover:border-zinc-400 hover:bg-zinc-50",
          uploading ? "pointer-events-none opacity-60" : "",
        ].join(" ")}
      >
        <p className="text-sm font-medium text-zinc-800">
          {uploading ? "Uploading…" : "Drop image here"}
        </p>
        <p className="mt-1 text-xs text-zinc-500">or click to browse</p>
      </div>
      <input
        ref={inputRef}
        id={fieldId}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        onChange={(e) => {
          void handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <p className="text-xs text-zinc-500">{helpText}</p>
      <div className="space-y-1">
        <label htmlFor={`${fieldId}-url`} className="text-xs font-medium text-zinc-600">
          Or paste image URL
        </label>
        <input
          id={`${fieldId}-url`}
          type="url"
          value={url}
          onChange={(e) => {
            clearError();
            setUrl(sanitizeStoredImageUrl(e.target.value));
          }}
          placeholder="https://… or /images/your-photo.png"
          className="min-h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-400 focus:ring-2"
        />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {url ? (
        <div className="space-y-2">
          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="mx-auto max-h-56 w-full object-contain" />
          </div>
          <button
            type="button"
            onClick={() => setUrl("")}
            className="text-sm font-medium text-zinc-600 underline-offset-2 hover:text-zinc-900 hover:underline"
          >
            Remove image
          </button>
        </div>
      ) : null}
    </div>
  );
}
