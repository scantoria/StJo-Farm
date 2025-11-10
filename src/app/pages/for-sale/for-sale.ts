import { Component, signal, inject, OnInit, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ListingCardComponent } from '../../shared/components/listing-card/listing-card.component';
import { PageBannerComponent } from '../../shared/components/page-banner/page-banner.component';
import { ListingService } from '../../core/services/listing.service';
import { Listing } from '../../core/models/listing.model';

@Component({
  selector: 'app-for-sale',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ListingCardComponent,
    PageBannerComponent
  ],
  templateUrl: './for-sale.html',
  styleUrl: './for-sale.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForSale implements OnInit {
  private listingService = inject(ListingService);

  allListings = signal<Listing[]>([]);
  loading = signal(false);

  selectedCategory = 'all';
  selectedAvailability = 'available';

  filteredListings = computed(() => {
    return this.allListings().filter(listing => {
      // Category filter
      const categoryMatch = this.selectedCategory === 'all' || listing.category === this.selectedCategory;

      // Availability filter
      let availabilityMatch = true;
      if (this.selectedAvailability === 'available') {
        availabilityMatch = listing.available === true;
      } else if (this.selectedAvailability === 'sold') {
        availabilityMatch = listing.available === false;
      }

      return categoryMatch && availabilityMatch;
    });
  });

  ngOnInit(): void {
    this.loadListings();
  }

  loadListings(): void {
    this.loading.set(true);
    this.listingService.getListings().subscribe({
      next: (listings) => {
        this.allListings.set(listings);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading listings:', error);
        this.loading.set(false);
      }
    });
  }

  onFilterChange(): void {
    // Filters are applied automatically via computed signal
  }

  clearFilters(): void {
    this.selectedCategory = 'all';
    this.selectedAvailability = 'available';
  }

  viewListing(listing: Listing): void {
    // Could implement a detail modal or navigate to detail page
    console.log('View listing:', listing);
    // For now, scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
