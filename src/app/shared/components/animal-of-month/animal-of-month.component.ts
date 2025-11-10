import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

export interface AnimalOfMonth {
  name: string;
  imageUrl: string;
  description: string;
  month: string;
  year: number;
}

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
