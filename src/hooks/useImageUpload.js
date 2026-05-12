import { useState, useCallback } from "react";
import { uploadImage, deleteImage, updateImage } from "@/lib/imageUploadUtils";

/**
 * Custom hook for managing image uploads
 * @param {string} bucket - Supabase storage bucket
 * @param {string} folder - Folder within bucket
 */
export function useImageUpload(bucket = "images", folder = "") {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const upload = useCallback(
    async (file) => {
      try {
        setUploading(true);
        setError(null);
        const result = await uploadImage(file, bucket, folder);
        return result;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setUploading(false);
      }
    },
    [bucket, folder],
  );

  const remove = useCallback(
    async (path) => {
      try {
        setUploading(true);
        setError(null);
        await deleteImage(path, bucket);
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setUploading(false);
      }
    },
    [bucket],
  );

  const update = useCallback(
    async (file, oldPath) => {
      try {
        setUploading(true);
        setError(null);
        const result = await updateImage(file, oldPath, bucket, folder);
        return result;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setUploading(false);
      }
    },
    [bucket, folder],
  );

  const reset = useCallback(() => {
    setError(null);
    setUploading(false);
  }, []);

  return {
    upload,
    remove,
    update,
    reset,
    uploading,
    error,
  };
}
