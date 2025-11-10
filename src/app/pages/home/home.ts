import { Component, signal, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ListingCardComponent } from '../../shared/components/listing-card/listing-card.component';
import { AnimalOfMonthComponent } from '../../shared/components/animal-of-month/animal-of-month.component';
import { ListingService } from '../../core/services/listing.service';
import { AnimalOfMonthService } from '../../core/services/animal-of-month.service';
import { Listing } from '../../core/models/listing.model';
import { AnimalOfMonth } from '../../core/models/animal-of-month.model';

interface Offering {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ListingCardComponent,
    AnimalOfMonthComponent
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home implements OnInit {
  private listingService = inject(ListingService);
  private animalOfMonthService = inject(AnimalOfMonthService);

  featuredListings = signal<Listing[]>([]);
  loading = signal(false);
  farmImageExists = signal(true);
  animalOfMonth = signal<AnimalOfMonth | null>(null);

  offerings: Offering[] = [
    {
      icon: 'water_drop',
      title: 'Fresh Dairy',
      description: 'Quality milk from our show dairy cows for family use and feeding our young animals'
    },
    {
      icon: 'agriculture',
      title: 'Livestock',
      description: 'Dairy cows, heifers, steers, and quality goats for sale'
    },
    {
      icon: 'directions_run',
      title: 'Thoroughbred Horses',
      description: 'Beautiful thoroughbred horses available for purchase'
    },
    {
      icon: 'egg',
      title: 'Farm Fresh Eggs',
      description: 'Fresh chicken eggs from our free-range chickens'
    },
    {
      icon: 'volunteer_activism',
      title: 'Calf Adoption',
      description: 'Helping calves find new homes when owners can\'t keep them'
    },
    {
      icon: 'agriculture',
      title: 'Sustainable Farming',
      description: 'Committed to ethical and sustainable farming practices'
    }
  ];

  ngOnInit(): void {
    this.loadFeaturedListings();
    this.loadAnimalOfMonth();
  }

  loadAnimalOfMonth(): void {
    this.animalOfMonthService.getActiveAnimal().subscribe({
      next: (animal) => {
        this.animalOfMonth.set(animal);
      },
      error: (error) => {
        console.error('Error loading animal of the month:', error);
      }
    });
  }

  loadFeaturedListings(): void {
    this.loading.set(true);
    this.listingService.getAvailableListings().subscribe({
      next: (listings) => {
        // Get first 3 listings for preview
        this.featuredListings.set(listings.slice(0, 3));
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading listings:', error);
        this.loading.set(false);
      }
    });
  }

  viewListing(listing: Listing): void {
    // Navigate to for-sale page (could add detail view later)
    // For now, just scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
