import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, orderBy, Timestamp } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL, deleteObject } from '@angular/fire/storage';
import { Observable, from, map } from 'rxjs';
import { Listing } from '../models/listing.model';

@Injectable({
  providedIn: 'root'
})
export class ListingService {
  private firestore = inject(Firestore);
  private storage = inject(Storage);
  private listingsCollection = 'listings';

  // Get all listings
  getListings(): Observable<Listing[]> {
    const listingsRef = collection(this.firestore, this.listingsCollection);
    const q = query(listingsRef, orderBy('createdAt', 'desc'));

    return from(getDocs(q)).pipe(
      map(snapshot =>
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data()['createdAt']?.toDate(),
          updatedAt: doc.data()['updatedAt']?.toDate()
        } as Listing))
      )
    );
  }

  // Get available listings only
  getAvailableListings(): Observable<Listing[]> {
    const listingsRef = collection(this.firestore, this.listingsCollection);
    const q = query(listingsRef, where('available', '==', true), orderBy('createdAt', 'desc'));

    return from(getDocs(q)).pipe(
      map(snapshot =>
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data()['createdAt']?.toDate(),
          updatedAt: doc.data()['updatedAt']?.toDate()
        } as Listing))
      )
    );
  }

  // Add new listing
  async addListing(listing: Omit<Listing, 'id'>, images: File[]): Promise<string> {
    try {
      const imageUrls = await this.uploadImages(images);

      const docRef = await addDoc(collection(this.firestore, this.listingsCollection), {
        ...listing,
        imageUrls,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      return docRef.id;
    } catch (error) {
      console.error('Error adding listing:', error);
      throw error;
    }
  }

  // Update listing
  async updateListing(id: string, listing: Partial<Listing>, newImages?: File[]): Promise<void> {
    try {
      const docRef = doc(this.firestore, this.listingsCollection, id);
      const updateData: any = {
        ...listing,
        updatedAt: Timestamp.now()
      };

      if (newImages && newImages.length > 0) {
        const newImageUrls = await this.uploadImages(newImages);
        updateData.imageUrls = [...(listing.imageUrls || []), ...newImageUrls];
      }

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating listing:', error);
      throw error;
    }
  }

  // Delete listing
  async deleteListing(id: string, imageUrls: string[]): Promise<void> {
    try {
      // Delete images from storage
      for (const url of imageUrls) {
        await this.deleteImage(url);
      }

      // Delete document
      const docRef = doc(this.firestore, this.listingsCollection, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting listing:', error);
      throw error;
    }
  }

  // Upload images to Firebase Storage
  private async uploadImages(images: File[]): Promise<string[]> {
    const uploadPromises = images.map(async (image) => {
      const timestamp = Date.now();
      const fileName = `listings/${timestamp}_${image.name}`;
      const storageRef = ref(this.storage, fileName);

      await uploadBytes(storageRef, image);
      return await getDownloadURL(storageRef);
    });

    return await Promise.all(uploadPromises);
  }

  // Delete image from storage
  private async deleteImage(imageUrl: string): Promise<void> {
    try {
      const imageRef = ref(this.storage, imageUrl);
      await deleteObject(imageRef);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  }
}
