import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ContactService } from '../../core/services/contact.service';
import { EmailService } from '../../core/services/email.service';
import { ContactMessage } from '../../core/models/listing.model';

@Component({
  selector: 'app-contact',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Contact {
  private contactService = inject(ContactService);
  private emailService = inject(EmailService);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  showSuccess = signal(false);
  isSubmitting = signal(false);

  contactForm: FormGroup;

  constructor() {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.contactForm.valid && !this.isSubmitting()) {
      this.isSubmitting.set(true);

      try {
        const formValue = this.contactForm.value;

        // Save to Firestore
        const messageId = await this.contactService.submitContactMessage(
          formValue as Omit<ContactMessage, 'id' | 'createdAt' | 'status'>,
          []
        );

        // Send email notification (optional - requires Firebase Functions setup)
        try {
          await this.emailService.sendContactEmail({
            ...formValue,
            id: messageId,
            createdAt: new Date(),
            status: 'new'
          } as ContactMessage);
        } catch (emailError) {
          console.log('Email notification failed, but message was saved:', emailError);
        }

        // Show success
        this.showSuccess.set(true);
        this.contactForm.reset();
        this.isSubmitting.set(false);

        // Hide success message after 5 seconds
        setTimeout(() => {
          this.showSuccess.set(false);
        }, 5000);

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

      } catch (error) {
        console.error('Error submitting contact form:', error);
        this.snackBar.open('Error sending message. Please try again.', 'Close', { duration: 5000 });
        this.isSubmitting.set(false);
      }
    }
  }
}
