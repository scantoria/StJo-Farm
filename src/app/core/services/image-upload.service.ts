import { Injectable, inject } from '@angular/core';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  private storage = inject(Storage);

  /**
   * Upload an image to Firebase Storage
   * @param file The image file to upload
   * @param path The storage path (e.g., 'animals-of-month/millie.jpg')
   * @returns Promise with the download URL
   */
  async uploadImage(file: File, path: string): Promise<string> {
    const storageRef = ref(this.storage, path);

    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  }

  /**
   * Upload an image with auto-generated filename
   * @param file The image file to upload
   * @param folder The folder to upload to (e.g., 'animals-of-month')
   * @returns Promise with the download URL
   */
  async uploadImageWithAutoName(file: File, folder: string): Promise<string> {
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const path = `${folder}/${timestamp}_${sanitizedFileName}`;

    return this.uploadImage(file, path);
  }

  /**
   * Delete an image from Firebase Storage
   * @param imageUrl The full download URL or path
   */
  async deleteImage(imageUrl: string): Promise<void> {
    try {
      // Extract the path from the URL if it's a full URL
      let path = imageUrl;

      if (imageUrl.includes('firebasestorage.googleapis.com')) {
        // Extract path from Firebase Storage URL
        const pathMatch = imageUrl.match(/\/o\/(.+?)\?/);
        if (pathMatch && pathMatch[1]) {
          path = decodeURIComponent(pathMatch[1]);
        }
      }

      const storageRef = ref(this.storage, path);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }

  /**
   * Validate image file
   * @param file The file to validate
   * @returns Error message if invalid, null if valid
   */
  validateImage(file: File): string | null {
    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return 'Please upload a valid image file (JPEG, PNG, GIF, or WebP)';
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return 'Image size must be less than 5MB';
    }

    return null;
  }

  /**
   * Create a preview URL for an image file
   * @param file The image file
   * @returns Promise with the preview URL
   */
  createPreviewUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
