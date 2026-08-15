"use client";

import { ImagePlus, X } from "lucide-react";
import { useState } from "react";
import { useUploadImageMutation } from "@/features/upload/api/upload.api";

export function ImageUploadField({
  images,
  onChange,
  maxImages = 8,
}: {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}) {
  const [uploadImage, { isLoading }] = useUploadImageMutation();
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setError(null);
    try {
      const result = await uploadImage(file).unwrap();
      onChange([...images, result.url]);
    } catch {
      setError("Tải ảnh lên thất bại. Vui lòng thử lại.");
    }
  };

  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap gap-2">
        {images.map((url, index) => (
          <div
            key={`${url}-${index}`}
            className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-[var(--radius-md)] border border-border"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Xoá ảnh</span>
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <label className="flex h-20 w-20 shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] border border-dashed border-input text-muted-foreground transition-colors hover:bg-muted">
            <ImagePlus className="h-5 w-5" />
            <span className="text-[10px]">{isLoading ? "Đang tải..." : "Thêm ảnh"}</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleFileChange}
              disabled={isLoading}
            />
          </label>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
