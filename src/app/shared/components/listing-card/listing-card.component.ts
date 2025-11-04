import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Listing } from '../../../core/models/listing.model';

@Component({
  selector: 'app-listing-card',
  imports: [CommonModule, MatCardModule, MatChipsModule, MatIconModule, MatButtonModule],
  templateUrl: './listing-card.component.html',
  styleUrls: ['./listing-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListingCardComponent {
  listing = input.required<Listing>();
  isAdmin = input<boolean>(false);
  showActions = input<boolean>(true);

  view = output<Listing>();
  edit = output<Listing>();
  delete = output<Listing>();

  getCategoryLabel(category: string): string {
    const labels: { [key: string]: string } = {
      'dairy-cow': 'Dairy Cow',
      'heifer': 'Heifer',
      'steer': 'Steer',
      'goat-wether': 'Wether Goat',
      'goat-doe': 'Doe Goat',
      'horse': 'Horse',
      'eggs': 'Eggs',
      'other': 'Other'
    };
    return labels[category] || category;
  }

  truncateDescription(description: string, maxLength: number = 150): string {
    if (description.length <= maxLength) {
      return description;
    }
    return description.substring(0, maxLength) + '...';
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/placeholder.png';
  }

  onView(): void {
    this.view.emit(this.listing());
  }

  onEdit(): void {
    this.edit.emit(this.listing());
  }

  onDelete(): void {
    this.delete.emit(this.listing());
  }
}
