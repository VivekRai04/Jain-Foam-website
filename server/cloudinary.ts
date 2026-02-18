/**
 * Cloudinary integration for image uploads
 * Free tier: 25MB storage, 25GB bandwidth
 */

import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
}

/**
 * Upload image to Cloudinary
 * @param imageBuffer - The image file buffer
 * @param filename - Original filename (used as public_id)
 * @returns The Cloudinary URL or null if failed
 */
export async function uploadToCloudinary(
  imageBuffer: Buffer, 
  filename: string
): Promise<string | null> {
  try {
    // Extract base name without extension for public_id
    const publicId = filename.replace(/\.[^/.]+$/, '');
    
    // Upload to Cloudinary
    const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          public_id: `jain_foam/${publicId}`,
          folder: 'jain_foam',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve(result as CloudinaryUploadResult);
          } else {
            reject(new Error('No result from Cloudinary'));
          }
        }
      );
      
      uploadStream.end(imageBuffer);
    });

    console.log(`✓ Uploaded to Cloudinary: ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return null;
  }
}

/**
 * Delete image from Cloudinary
 * @param publicId - The public ID of the image
 * @returns True if successful
 */
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return false;
  }
}

export { cloudinary };
