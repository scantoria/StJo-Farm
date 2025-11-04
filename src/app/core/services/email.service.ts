import { Injectable, inject } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { ContactMessage, CalfAdoptionRequest } from '../models/listing.model';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private functions = inject(Functions);

  async sendContactEmail(message: ContactMessage): Promise<void> {
    const sendEmail = httpsCallable(this.functions, 'sendContactEmail');
    await sendEmail(message);
  }

  async sendCalfAdoptionEmail(request: CalfAdoptionRequest): Promise<void> {
    const sendEmail = httpsCallable(this.functions, 'sendCalfAdoptionEmail');
    await sendEmail(request);
  }
}
