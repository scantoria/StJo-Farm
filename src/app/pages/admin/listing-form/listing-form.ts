import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ListingService } from '../../../core/services/listing.service';
import { Listing } from '../../../core/models/listing.model';

interface DialogData {
  mode: 'add' | 'edit';
  listing?: Listing;
}

@Component({
  selector: 'app-listing-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './listing-form.html',
  styleUrl: './listing-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListingForm {
  private fb = inject(FormBuilder);
  private listingService = inject(ListingService);
  private dialogRef = inject(MatDialogRef<ListingForm>);
  private snackBar = inject(MatSnackBar);
  public data = inject<DialogData>(MAT_DIALOG_DATA);

  listingForm: FormGroup;
  mode: 'add' | 'edit' = 'add';
  existingImageUrls = signal<string[]>([]);
  newImageFiles = signal<File[]>([]);
  isSubmitting = signal(false);

  constructor() {
    this.mode = this.data.mode;

    this.listingForm = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      available: [true]
    });

    if (this.mode === 'edit' && this.data.listing) {
      const listing = this.data.listing;
      this.listingForm.patchValue({
        title: listing.title,
        category: listing.category,
        description: listing.description,
        price: listing.price,
        available: listing.available
      });
      this.existingImageUrls.set([...listing.imageUrls]);
    }
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      this.newImageFiles.update(current => [...current, ...files]);
    }
  }

  removeExistingImage(index: number): void {
    this.existingImageUrls.update(urls => {
      const updated = [...urls];
      updated.splice(index, 1);
      return updated;
    });
  }

  removeNewImage(index: number): void {
    this.newImageFiles.update(files => {
      const updated = [...files];
      updated.splice(index, 1);
      return updated;
    });
  }

  getImagePreview(file: File): string {
    return URL.createObjectURL(file);
  }

  hasImages(): boolean {
    return this.existingImageUrls().length > 0 || this.newImageFiles().length > 0;
  }

  async onSubmit(): Promise<void> {
    if (this.listingForm.valid && !this.isSubmitting() && this.hasImages()) {
      this.isSubmitting.set(true);

      try {
        const formValue = this.listingForm.value;

        if (this.mode === 'add') {
          // Create new listing
          const listingData: Omit<Listing, 'id'> = {
            title: formValue.title,
            category: formValue.category,
            description: formValue.description,
            price: parseFloat(formValue.price),
            available: formValue.available,
            imageUrls: [], // Will be populated by service
            createdAt: new Date(),
            updatedAt: new Date()
          };

          await this.listingService.addListing(listingData, this.newImageFiles());
          this.snackBar.open('Listing created successfully!', 'Close', { duration: 3000 });
          this.dialogRef.close(true);

        } else if (this.mode === 'edit' && this.data.listing) {
          // Update existing listing
          const updateData: Partial<Listing> = {
            title: formValue.title,
            category: formValue.category,
            description: formValue.description,
            price: parseFloat(formValue.price),
            available: formValue.available,
            imageUrls: this.existingImageUrls()
          };

          await this.listingService.updateListing(
            this.data.listing.id!,
            updateData,
            this.newImageFiles()
          );
          this.snackBar.open('Listing updated successfully!', 'Close', { duration: 3000 });
          this.dialogRef.close(true);
        }

      } catch (error) {
        console.error('Error saving listing:', error);
        this.snackBar.open('Error saving listing. Please try again.', 'Close', { duration: 3000 });
        this.isSubmitting.set(false);
      }
    } else if (!this.hasImages()) {
      this.snackBar.open('Please add at least one image', 'Close', { duration: 3000 });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
