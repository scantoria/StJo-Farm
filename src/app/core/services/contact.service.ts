import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, query, orderBy, Timestamp, updateDoc, doc } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Observable, from, map } from 'rxjs';
import { ContactMessage } from '../models/listing.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private firestore = inject(Firestore);
  private storage = inject(Storage);
  private contactCollection = 'contact-messages';

  // Submit contact message
  async submitContactMessage(message: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>, images: File[] = []): Promise<string> {
    try {
      const imageUrls = images.length > 0 ? await this.uploadImages(images) : [];

      const docRef = await addDoc(collection(this.firestore, this.contactCollection), {
        ...message,
        imageUrls,
        createdAt: Timestamp.now(),
        status: 'new'
      });

      return docRef.id;
    } catch (error) {
      console.error('Error submitting contact message:', error);
      throw error;
    }
  }

  // Get all contact messages (admin)
  getContactMessages(): Observable<ContactMessage[]> {
    const messagesRef = collection(this.firestore, this.contactCollection);
    const q = query(messagesRef, orderBy('createdAt', 'desc'));

    return from(getDocs(q)).pipe(
      map(snapshot =>
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data()['createdAt']?.toDate()
        } as ContactMessage))
      )
    );
  }

  // Update message status
  async updateMessageStatus(id: string, status: ContactMessage['status']): Promise<void> {
    const docRef = doc(this.firestore, this.contactCollection, id);
    await updateDoc(docRef, { status });
  }

  // Upload images
  private async uploadImages(images: File[]): Promise<string[]> {
    const uploadPromises = images.map(async (image) => {
      const timestamp = Date.now();
      const fileName = `contact/${timestamp}_${image.name}`;
      const storageRef = ref(this.storage, fileName);

      await uploadBytes(storageRef, image);
      return await getDownloadURL(storageRef);
    });

    return await Promise.all(uploadPromises);
  }
}
