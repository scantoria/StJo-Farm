import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PageBannerComponent } from '../../shared/components/page-banner/page-banner.component';

@Component({
  selector: 'app-animals',
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, PageBannerComponent],
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
