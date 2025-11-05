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
  // Set these to true when you add actual images
  dairyCowsImageExists = signal(false);
  calvesImageExists = signal(false);
  goatsImageExists = signal(false);
  horsesImageExists = signal(false);
  chickensImageExists = signal(false);
}
