import React, { useState, useRef } from "react";
import { Upload, X, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadImage, handleImageFileInput } from "@/lib/imageUploadUtils";
import { toast } from "sonner";

export default function ImageUploadField({
  value,
  onChange,
  label = "Image",
  bucket = "images",
  folder = "",
  required = false,
}) {
  const [preview, setPreview] = useState(value || null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Sync preview with incoming value prop
  React.useEffect(() => {
    setPreview(value);
  }, [value]);

  const handleFileChange = async (e) => {
    try {
      const result = await handleImageFileInput(e);
      if (!result) return;

      const { file, preview: previewUrl } = result;
      setPreview(previewUrl);

      // Upload to Supabase
      setUploading(true);
      const uploadedImage = await uploadImage(file, bucket, folder);
      onChange(uploadedImage.url);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(error.message || "Failed to upload image");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[var(--admin-text-muted)]">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {preview ? (
        <div className="relative group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-xl border border-[var(--admin-border)]"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="rounded-lg"
            >
              {uploading ? (
                <>
                  <Loader className="w-3 h-3 mr-1 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-3 h-3 mr-1" />
                  Change
                </>
              )}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={handleRemove}
              disabled={uploading}
              className="rounded-lg"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-[var(--admin-border)] rounded-xl p-8 text-center cursor-pointer hover:bg-black/2 dark:hover:bg-white/2 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-8 h-8 text-[var(--admin-text-muted)] mx-auto mb-2 opacity-50" />
          <p className="text-sm text-[var(--admin-text-muted)] font-medium">
            Click to upload image
          </p>
          <p className="text-xs text-[var(--admin-text-muted)]/50 mt-1">
            PNG, JPG, WebP or GIF (max 5MB)
          </p>
          {uploading && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <Loader className="w-4 h-4 animate-spin text-emerald-500" />
              <span className="text-xs text-emerald-500">Uploading...</span>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={uploading}
      />

      {value && !preview && (
        <p className="text-xs text-[var(--admin-text-muted)]/60 truncate">
          {value}
        </p>
      )}
    </div>
  );
}
