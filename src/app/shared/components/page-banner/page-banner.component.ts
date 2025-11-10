import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-page-banner',
  imports: [CommonModule, MatIconModule],
  templateUrl: './page-banner.component.html',
  styleUrl: './page-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageBannerComponent {
  title = input.required<string>();
  subtitle = input<string>('');
  icon = input<string>('');
}
