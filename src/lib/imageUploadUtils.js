import { supabase } from "@/api/supabaseClient";

/**
 * Upload an image file to Supabase storage
 * @param {File} file - The image file to upload
 * @param {string} bucket - The storage bucket name (default: 'images')
 * @param {string} folder - Optional folder path within the bucket
 * @returns {Promise<{url: string, path: string}>} - The public URL and storage path
 */
export async function uploadImage(file, bucket = "images", folder = "") {
  if (!file) throw new Error("No file provided");

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Invalid file type. Allowed: JPEG, PNG, WebP, GIF");
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error("File size exceeds 5MB limit");
  }

  try {
    // Generate unique filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const ext = file.name.split(".").pop();
    const filename = `${timestamp}_${random}.${ext}`;
    const path = folder ? `${folder}/${filename}` : filename;

    // Upload file
    const { data, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return {
      url: publicUrlData.publicUrl,
      path: path,
      filename: filename,
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

/**
 * Delete an image from Supabase storage
 * @param {string} path - The storage path of the file to delete
 * @param {string} bucket - The storage bucket name (default: 'images')
 */
export async function deleteImage(path, bucket = "images") {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
}

/**
 * Update an image (delete old, upload new)
 * @param {File} newFile - The new image file
 * @param {string} oldPath - The old image path to delete
 * @param {string} bucket - The storage bucket name
 * @param {string} folder - Optional folder path
 */
export async function updateImage(
  newFile,
  oldPath,
  bucket = "images",
  folder = "",
) {
  try {
    // Upload new image
    const newImage = await uploadImage(newFile, bucket, folder);

    // Delete old image if path exists
    if (oldPath) {
      try {
        await deleteImage(oldPath, bucket);
      } catch (err) {
        console.warn("Could not delete old image:", err);
      }
    }

    return newImage;
  } catch (error) {
    console.error("Error updating image:", error);
    throw error;
  }
}

/**
 * Get image from file input and preview
 * @param {Event} event - File input change event
 * @returns {Promise<{file: File, preview: string}>}
 */
export async function handleImageFileInput(event) {
  const file = event.target.files?.[0];
  if (!file) return null;

  // Create preview
  const preview = URL.createObjectURL(file);

  return {
    file,
    preview,
  };
}
