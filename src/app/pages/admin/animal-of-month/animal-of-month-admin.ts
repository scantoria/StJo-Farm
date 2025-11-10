import { Component, signal, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AnimalOfMonthService } from '../../../core/services/animal-of-month.service';
import { ImageUploadService } from '../../../core/services/image-upload.service';
import { AnimalOfMonth } from '../../../core/models/animal-of-month.model';

@Component({
  selector: 'app-animal-of-month-admin',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatTooltipModule,
    MatProgressBarModule
  ],
  templateUrl: './animal-of-month-admin.html',
  styleUrl: './animal-of-month-admin.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnimalOfMonthAdmin implements OnInit {
  private fb = inject(FormBuilder);
  private animalService = inject(AnimalOfMonthService);
  private imageUploadService = inject(ImageUploadService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  animals = signal<AnimalOfMonth[]>([]);
  loading = signal(false);
  uploading = signal(false);
  isEditing = signal(false);
  editingId = signal<string | null>(null);
  selectedFile = signal<File | null>(null);
  previewUrl = signal<string | null>(null);

  animalForm: FormGroup;
  displayedColumns = ['name', 'month', 'year', 'isActive', 'actions'];

  constructor() {
    this.animalForm = this.fb.group({
      name: ['', Validators.required],
      imageUrl: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(50)]],
      month: ['', Validators.required],
      year: [new Date().getFullYear(), [Validators.required, Validators.min(2020)]],
      isActive: [false]
    });
  }

  ngOnInit(): void {
    this.loadAnimals();
  }

  loadAnimals(): void {
    this.loading.set(true);
    this.animalService.getAllAnimals().subscribe({
      next: (animals) => {
        this.animals.set(animals);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading animals:', error);
        this.snackBar.open('Error loading animals', 'Close', { duration: 3000 });
        this.loading.set(false);
      }
    });
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    // Validate the image
    const validationError = this.imageUploadService.validateImage(file);
    if (validationError) {
      this.snackBar.open(validationError, 'Close', { duration: 3000 });
      return;
    }

    this.selectedFile.set(file);

    // Create preview
    try {
      const previewUrl = await this.imageUploadService.createPreviewUrl(file);
      this.previewUrl.set(previewUrl);
    } catch (error) {
      console.error('Error creating preview:', error);
    }
  }

  clearSelectedImage(): void {
    this.selectedFile.set(null);
    this.previewUrl.set(null);
  }

  async onSubmit(): Promise<void> {
    if (this.animalForm.invalid) {
      this.snackBar.open('Please fill all required fields', 'Close', { duration: 3000 });
      return;
    }

    this.loading.set(true);

    try {
      let imageUrl = this.animalForm.value.imageUrl;

      // If a new file is selected, upload it
      if (this.selectedFile()) {
        this.uploading.set(true);
        imageUrl = await this.imageUploadService.uploadImageWithAutoName(
          this.selectedFile()!,
          'animals-of-month'
        );
        this.uploading.set(false);
      }

      const formValue = {
        ...this.animalForm.value,
        imageUrl
      };

      if (this.isEditing() && this.editingId()) {
        await this.animalService.updateAnimal(this.editingId()!, formValue);
        this.snackBar.open('Animal updated successfully', 'Close', { duration: 3000 });
      } else {
        await this.animalService.addAnimal(formValue);
        this.snackBar.open('Animal added successfully', 'Close', { duration: 3000 });
      }

      this.resetForm();
      this.loadAnimals();
    } catch (error) {
      console.error('Error saving animal:', error);
      this.snackBar.open('Error saving animal', 'Close', { duration: 3000 });
    } finally {
      this.loading.set(false);
      this.uploading.set(false);
    }
  }

  editAnimal(animal: AnimalOfMonth): void {
    this.isEditing.set(true);
    this.editingId.set(animal.id!);

    this.animalForm.patchValue({
      name: animal.name,
      imageUrl: animal.imageUrl,
      description: animal.description,
      month: animal.month,
      year: animal.year,
      isActive: animal.isActive
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async deleteAnimal(animal: AnimalOfMonth): Promise<void> {
    if (!confirm(`Are you sure you want to delete "${animal.name}"?`)) {
      return;
    }

    this.loading.set(true);

    try {
      await this.animalService.deleteAnimal(animal.id!);
      this.snackBar.open('Animal deleted successfully', 'Close', { duration: 3000 });
      this.loadAnimals();
    } catch (error) {
      console.error('Error deleting animal:', error);
      this.snackBar.open('Error deleting animal', 'Close', { duration: 3000 });
    } finally {
      this.loading.set(false);
    }
  }

  async setActive(animal: AnimalOfMonth): Promise<void> {
    this.loading.set(true);

    try {
      await this.animalService.setActiveAnimal(animal.id!);
      this.snackBar.open(`${animal.name} is now the active animal of the month`, 'Close', { duration: 3000 });
      this.loadAnimals();
    } catch (error) {
      console.error('Error setting active animal:', error);
      this.snackBar.open('Error setting active animal', 'Close', { duration: 3000 });
    } finally {
      this.loading.set(false);
    }
  }

  resetForm(): void {
    this.animalForm.reset({
      year: new Date().getFullYear(),
      isActive: false
    });
    this.isEditing.set(false);
    this.editingId.set(null);
    this.clearSelectedImage();
  }

  cancelEdit(): void {
    this.resetForm();
  }
}
