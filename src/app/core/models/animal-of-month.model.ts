export interface AnimalOfMonth {
  id?: string;
  name: string;
  imageUrl: string;
  description: string;
  month: string;
  year: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
