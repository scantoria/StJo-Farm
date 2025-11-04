import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, query, orderBy, Timestamp, updateDoc, doc } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Observable, from, map } from 'rxjs';
import { CalfAdoptionRequest } from '../models/listing.model';

@Injectable({
  providedIn: 'root'
})
export class CalfAdoptionService {
  private firestore = inject(Firestore);
  private storage = inject(Storage);
  private adoptionCollection = 'calf-adoptions';

  // Submit calf adoption request
  async submitAdoptionRequest(request: Omit<CalfAdoptionRequest, 'id' | 'createdAt' | 'status'>, images: File[]): Promise<string> {
    try {
      const imageUrls = await this.uploadImages(images);

      const docRef = await addDoc(collection(this.firestore, this.adoptionCollection), {
        ...request,
        imageUrls,
        createdAt: Timestamp.now(),
        status: 'pending'
      });

      return docRef.id;
    } catch (error) {
      console.error('Error submitting adoption request:', error);
      throw error;
    }
  }

  // Get all adoption requests (admin)
  getAdoptionRequests(): Observable<CalfAdoptionRequest[]> {
    const requestsRef = collection(this.firestore, this.adoptionCollection);
    const q = query(requestsRef, orderBy('createdAt', 'desc'));

    return from(getDocs(q)).pipe(
      map(snapshot =>
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data()['createdAt']?.toDate()
        } as CalfAdoptionRequest))
      )
    );
  }

  // Update adoption request status
  async updateRequestStatus(id: string, status: CalfAdoptionRequest['status']): Promise<void> {
    const docRef = doc(this.firestore, this.adoptionCollection, id);
    await updateDoc(docRef, { status });
  }

  // Upload images
  private async uploadImages(images: File[]): Promise<string[]> {
    const uploadPromises = images.map(async (image) => {
      const timestamp = Date.now();
      const fileName = `adoptions/${timestamp}_${image.name}`;
      const storageRef = ref(this.storage, fileName);

      await uploadBytes(storageRef, image);
      return await getDownloadURL(storageRef);
    });

    return await Promise.all(uploadPromises);
  }
}
