import { Component, signal, output, input, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ContactMessage } from '../../../core/models/listing.model';

@Component({
  selector: 'app-contact-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactFormComponent {
  private fb = inject(FormBuilder);

  title = input<string>('Contact Us');
  showSubject = input<boolean>(true);
  showPhone = input<boolean>(true);
  allowImages = input<boolean>(true);
  submitButtonText = input<string>('Send Message');

  formSubmit = output<{ message: Partial<ContactMessage>, images: File[] }>();

  contactForm: FormGroup;
  selectedFiles = signal<File[]>([]);
  isSubmitting = signal(false);

  constructor() {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      subject: ['', Validators.required],
      message: ['', Validators.required]
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
      const newFiles = [...files];
      newFiles.splice(index, 1);
      return newFiles;
    });
  }

  getImagePreview(file: File): string {
    return URL.createObjectURL(file);
  }

  onSubmit(): void {
    if (this.contactForm.valid && !this.isSubmitting()) {
      this.isSubmitting.set(true);
      const formValue = this.contactForm.value;

      const message: Partial<ContactMessage> = {
        name: formValue.name,
        email: formValue.email,
        phone: formValue.phone,
        subject: formValue.subject,
        message: formValue.message
      };

      this.formSubmit.emit({
        message,
        images: this.selectedFiles()
      });
    }
  }

  resetForm(): void {
    this.contactForm.reset();
    this.selectedFiles.set([]);
    this.isSubmitting.set(false);
  }

  setSubmitting(value: boolean): void {
    this.isSubmitting.set(value);
  }
}
