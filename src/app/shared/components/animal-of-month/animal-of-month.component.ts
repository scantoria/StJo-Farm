import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { AnimalOfMonth } from '../../../core/models/animal-of-month.model';

@Component({
  selector: 'app-animal-of-month',
  imports: [CommonModule, MatCardModule],
  templateUrl: './animal-of-month.component.html',
  styleUrl: './animal-of-month.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnimalOfMonthComponent {
  animal = input.required<AnimalOfMonth>();
}
