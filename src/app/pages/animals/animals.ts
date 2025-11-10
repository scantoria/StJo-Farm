import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-animals',
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './animals.html',
  styleUrl: './animals.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Animals {
  dairyCowsImageExists = signal(true);
  calvesImageExists = signal(true);
  goatsImageExists = signal(true);
  horsesImageExists = signal(true);
  chickensImageExists = signal(true);
}
