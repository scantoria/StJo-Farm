import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AnimalOfMonth } from '../models/animal-of-month.model';

@Injectable({
  providedIn: 'root'
})
export class AnimalOfMonthService {
  private firestore = inject(Firestore);
  private collectionName = 'animalsOfMonth';

  /**
   * Get all animals of the month
   */
  getAllAnimals(): Observable<AnimalOfMonth[]> {
    const animalsCollection = collection(this.firestore, this.collectionName);
    const q = query(animalsCollection, orderBy('year', 'desc'), orderBy('month', 'desc'));

    return collectionData(q, { idField: 'id' }).pipe(
      map(animals => animals.map(animal => ({
        ...animal,
        createdAt: (animal['createdAt'] as Timestamp)?.toDate(),
        updatedAt: (animal['updatedAt'] as Timestamp)?.toDate()
      } as AnimalOfMonth)))
    );
  }

  /**
   * Get the currently active animal of the month
   */
  getActiveAnimal(): Observable<AnimalOfMonth | null> {
    const animalsCollection = collection(this.firestore, this.collectionName);
    const q = query(
      animalsCollection,
      where('isActive', '==', true),
      limit(1)
    );

    return collectionData(q, { idField: 'id' }).pipe(
      map(animals => {
        if (animals.length === 0) return null;
        const animal = animals[0];
        return {
          ...animal,
          createdAt: (animal['createdAt'] as Timestamp)?.toDate(),
          updatedAt: (animal['updatedAt'] as Timestamp)?.toDate()
        } as AnimalOfMonth;
      })
    );
  }

  /**
   * Add a new animal of the month
   */
  async addAnimal(animal: Omit<AnimalOfMonth, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const animalsCollection = collection(this.firestore, this.collectionName);
    const now = Timestamp.now();

    const docRef = await addDoc(animalsCollection, {
      ...animal,
      createdAt: now,
      updatedAt: now
    });

    return docRef.id;
  }

  /**
   * Update an existing animal of the month
   */
  async updateAnimal(id: string, animal: Partial<AnimalOfMonth>): Promise<void> {
    const animalDoc = doc(this.firestore, this.collectionName, id);
    const now = Timestamp.now();

    const updateData = {
      ...animal,
      updatedAt: now
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(key =>
      updateData[key] === undefined && delete updateData[key]
    );

    await updateDoc(animalDoc, updateData);
  }

  /**
   * Delete an animal of the month
   */
  async deleteAnimal(id: string): Promise<void> {
    const animalDoc = doc(this.firestore, this.collectionName, id);
    await deleteDoc(animalDoc);
  }

  /**
   * Set an animal as active (and deactivate all others)
   */
  async setActiveAnimal(id: string): Promise<void> {
    // First, get all animals and deactivate them
    const animals = await new Promise<AnimalOfMonth[]>((resolve) => {
      this.getAllAnimals().subscribe(animals => resolve(animals));
    });

    // Deactivate all animals
    const deactivatePromises = animals
      .filter(animal => animal.isActive && animal.id !== id)
      .map(animal => this.updateAnimal(animal.id!, { isActive: false }));

    await Promise.all(deactivatePromises);

    // Activate the selected animal
    await this.updateAnimal(id, { isActive: true });
  }
}
