export interface Listing {
  id?: string;
  title: string;
  description: string;
  category: 'dairy-cow' | 'heifer' | 'steer' | 'goat-wether' | 'goat-doe' | 'horse' | 'eggs' | 'other';
  price: number;
  imageUrls: string[];
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CalfAdoptionRequest {
  id?: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  calfAge: string;
  calfBreed: string;
  reason: string;
  additionalInfo: string;
  imageUrls: string[];
  createdAt: Date;
  status: 'pending' | 'reviewed' | 'accepted' | 'declined';
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  imageUrls?: string[];
  createdAt: Date;
  status: 'new' | 'read' | 'replied';
}