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
import { CalfAdoptionService } from '../../core/services/calf-adoption.service';
import { EmailService } from '../../core/services/email.service';
import { CalfAdoptionRequest } from '../../core/models/listing.model';

@Component({
  selector: 'app-calf-adoption',
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
  templateUrl: './calf-adoption.html',
  styleUrl: './calf-adoption.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalfAdoption {
  private fb = inject(FormBuilder);
  private adoptionService = inject(CalfAdoptionService);
  private emailService = inject(EmailService);
  private snackBar = inject(MatSnackBar);

  adoptionForm: FormGroup;
  selectedFiles = signal<File[]>([]);
  isSubmitting = signal(false);
  showSuccess = signal(false);
  submittedEmail = signal('');

  constructor() {
    this.adoptionForm = this.fb.group({
      ownerName: ['', Validators.required],
      ownerEmail: ['', [Validators.required, Validators.email]],
      ownerPhone: ['', Validators.required],
      calfAge: ['', Validators.required],
      calfBreed: ['', Validators.required],
      reason: ['', Validators.required],
      additionalInfo: ['']
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      this.selectedFiles.update(current => [...current, ...files]);
    }
  }

  removeImage(index: number): void {
    this.selectedFiles.update(files => {
      const updated = [...files];
      updated.splice(index, 1);
      return updated;
    });
  }

  getImagePreview(file: File): string {
    return URL.createObjectURL(file);
  }

  async onSubmit(): Promise<void> {
    if (this.adoptionForm.valid && !this.isSubmitting()) {
      this.isSubmitting.set(true);

      try {
        const formValue = this.adoptionForm.value;
        
        // Submit to Firestore
        const requestId = await this.adoptionService.submitAdoptionRequest(
          formValue,
          this.selectedFiles()
        );

        // Send email notification (optional)
        try {
          await this.emailService.sendCalfAdoptionEmail({
            ...formValue,
            id: requestId,
            imageUrls: [],
            createdAt: new Date(),
            status: 'pending'
          } as CalfAdoptionRequest);
        } catch (emailError) {
          console.log('Email notification failed, but request was saved:', emailError);
        }

        // Show success
        this.submittedEmail.set(formValue.ownerEmail);
        this.showSuccess.set(true);
        this.isSubmitting.set(false);

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

      } catch (error) {
        console.error('Error submitting adoption request:', error);
        this.snackBar.open('Error submitting request. Please try again.', 'Close', { duration: 5000 });
        this.isSubmitting.set(false);
      }
    }
  }

  resetForm(): void {
    this.adoptionForm.reset();
    this.selectedFiles.set([]);
    this.showSuccess.set(false);
    this.submittedEmail.set('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
