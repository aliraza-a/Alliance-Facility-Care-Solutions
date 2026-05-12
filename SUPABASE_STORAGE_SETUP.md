# Supabase Storage Setup Guide

This guide will help you set up image storage in Supabase for the Alliance Facility Care Solution website.

## Prerequisites

- Supabase project created
- Admin access to Supabase dashboard
- Environment variables already configured

## Step 1: Create Storage Buckets

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Create a new bucket named `images` (make it public)
4. Inside the `images` bucket, create the following folders:
   - `services` - for service images
   - `testimonials` - for testimonial/team images (optional)
   - `projects` - for before/after project images (optional)

## Step 2: Set Bucket Policies

For public read access (required for displaying images):

1. Click on the bucket name
2. Go to **Policies** tab
3. Add a policy with these settings:
   - **Effect**: ALLOW
   - **Operation**: SELECT
   - **Target role**: Public (anon)
   - **Condition**: Leave empty (all objects)

For authenticated uploads:

1. Add a new policy:
   - **Effect**: ALLOW
   - **Operation**: INSERT
   - **Target role**: Authenticated
   - **Condition**: `bucket_id = 'images'`

2. Add another policy for authenticated updates:
   - **Effect**: ALLOW
   - **Operation**: UPDATE
   - **Target role**: Authenticated
   - **Condition**: `bucket_id = 'images'`

3. Add another policy for authenticated deletes:
   - **Effect**: ALLOW
   - **Operation**: DELETE
   - **Target role**: Authenticated
   - **Condition**: `bucket_id = 'images'`

## Step 3: Test Image Upload

1. Go to the Admin Panel
2. Navigate to Services Manager
3. Click "Add New Service"
4. Use the image upload field to upload a test image
5. The image should upload and display a preview

## Environment Variables Required

Make sure these are in your `.env` file:

```
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Usage in Components

### Upload an Image

```javascript
import { uploadImage } from "@/lib/imageUploadUtils";

const uploadedImage = await uploadImage(file, "images", "services");
console.log(uploadedImage.url); // Public URL
```

### Using the ImageUploadField Component

```javascript
import ImageUploadField from "@/components/admin/ImageUploadField";

<ImageUploadField
  value={imageUrl}
  onChange={setImageUrl}
  bucket="images"
  folder="services"
  label="Service Image"
/>;
```

## Supported Image Types

- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)
- GIF (.gif)

## File Size Limit

Maximum file size: 5MB

## Troubleshooting

### "Bucket not found" error

- Make sure the bucket is public
- Check the bucket name matches exactly

### "Permission denied" error

- Verify the storage policies are set correctly
- Make sure authenticated users have INSERT/UPDATE/DELETE permissions

### Images not displaying

- Check the image URL is public (should have `publicUrl` property)
- Verify the file was uploaded by checking Storage tab in Supabase

### Upload fails silently

- Check browser console for error messages
- Verify file size is under 5MB
- Check file type is supported
