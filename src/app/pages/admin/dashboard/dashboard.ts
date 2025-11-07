import { Component, OnInit, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';
import { ListingService } from '../../../core/services/listing.service';
import { ContactService } from '../../../core/services/contact.service';
import { CalfAdoptionService } from '../../../core/services/calf-adoption.service';
import { Listing, ContactMessage, CalfAdoptionRequest } from '../../../core/models/listing.model';
import { ListingForm } from '../listing-form/listing-form';
// import { ListingCard } from '../../../shared/components/listing-card/listing-card'; // TODO: Implement ListingCard component

interface StatCard {
  title: string;
  value: number;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatProgressSpinnerModule
    // ListingCard // TODO: Add when ListingCard component is implemented
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Dashboard implements OnInit {
  private authService = inject(AuthService);
  private listingService = inject(ListingService);
  private contactService = inject(ContactService);
  private adoptionService = inject(CalfAdoptionService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  // Stats
  stats = signal<StatCard[]>([
    { title: 'Total Listings', value: 0, icon: 'inventory_2', color: 'blue' },
    { title: 'Available Items', value: 0, icon: 'check_circle', color: 'green' },
    { title: 'Contact Messages', value: 0, icon: 'mail', color: 'orange' },
    { title: 'Adoption Requests', value: 0, icon: 'favorite', color: 'red' }
  ]);

  // Listings
  listings = signal<Listing[]>([]);
  loadingListings = signal(false);

  // Contact Messages
  contactMessages = signal<ContactMessage[]>([]);
  loadingMessages = signal(false);
  contactDisplayedColumns: string[] = ['name', 'email', 'subject', 'createdAt', 'status', 'actions'];

  // Adoption Requests
  adoptionRequests = signal<CalfAdoptionRequest[]>([]);
  loadingAdoptions = signal(false);
  adoptionDisplayedColumns: string[] = ['ownerName', 'ownerEmail', 'calfBreed', 'createdAt', 'status', 'actions'];

  ngOnInit(): void {
    this.loadAllData();
  }

  async loadAllData(): Promise<void> {
    await Promise.all([
      this.loadListings(),
      this.loadContactMessages(),
      this.loadAdoptionRequests()
    ]);
    this.updateStats();
  }

  async loadListings(): Promise<void> {
    this.loadingListings.set(true);
    try {
      this.listingService.getListings().subscribe({
        next: (listings: Listing[]) => {
          this.listings.set(listings);
          this.loadingListings.set(false);
          this.updateStats();
        },
        error: (error: unknown) => {
          console.error('Error loading listings:', error);
          this.snackBar.open('Error loading listings', 'Close', { duration: 3000 });
          this.loadingListings.set(false);
        }
      });
    } catch (error) {
      console.error('Error loading listings:', error);
      this.loadingListings.set(false);
    }
  }

  async loadContactMessages(): Promise<void> {
    this.loadingMessages.set(true);
    try {
      this.contactService.getContactMessages().subscribe({
        next: (messages: ContactMessage[]) => {
          this.contactMessages.set(messages);
          this.loadingMessages.set(false);
          this.updateStats();
        },
        error: (error: unknown) => {
          console.error('Error loading messages:', error);
          this.snackBar.open('Error loading contact messages', 'Close', { duration: 3000 });
          this.loadingMessages.set(false);
        }
      });
    } catch (error) {
      console.error('Error loading messages:', error);
      this.loadingMessages.set(false);
    }
  }

  async loadAdoptionRequests(): Promise<void> {
    this.loadingAdoptions.set(true);
    try {
      this.adoptionService.getAdoptionRequests().subscribe({
        next: (requests: CalfAdoptionRequest[]) => {
          this.adoptionRequests.set(requests);
          this.loadingAdoptions.set(false);
          this.updateStats();
        },
        error: (error: unknown) => {
          console.error('Error loading adoption requests:', error);
          this.snackBar.open('Error loading adoption requests', 'Close', { duration: 3000 });
          this.loadingAdoptions.set(false);
        }
      });
    } catch (error) {
      console.error('Error loading adoption requests:', error);
      this.loadingAdoptions.set(false);
    }
  }

  updateStats(): void {
    const currentStats = this.stats();
    const totalListings = this.listings().length;
    const availableListings = this.listings().filter(l => l.available).length;
    const totalMessages = this.contactMessages().length;
    const totalAdoptions = this.adoptionRequests().length;

    this.stats.set([
      { ...currentStats[0], value: totalListings },
      { ...currentStats[1], value: availableListings },
      { ...currentStats[2], value: totalMessages },
      { ...currentStats[3], value: totalAdoptions }
    ]);
  }

  // Listing Actions
  openAddListing(): void {
    const dialogRef = this.dialog.open(ListingForm, {
      width: '800px',
      maxHeight: '90vh',
      data: { mode: 'add' }
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.loadListings();
      }
    });
  }

  editListing(listing: Listing): void {
    const dialogRef = this.dialog.open(ListingForm, {
      width: '800px',
      maxHeight: '90vh',
      data: { mode: 'edit', listing }
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.loadListings();
      }
    });
  }

  async deleteListing(listing: Listing): Promise<void> {
    if (confirm(`Are you sure you want to delete "${listing.title}"?`)) {
      try {
        await this.listingService.deleteListing(listing.id!, listing.imageUrls);
        this.snackBar.open('Listing deleted successfully', 'Close', { duration: 3000 });
        await this.loadListings();
      } catch (error) {
        console.error('Error deleting listing:', error);
        this.snackBar.open('Error deleting listing', 'Close', { duration: 3000 });
      }
    }
  }

  // Contact Message Actions
  async updateMessageStatus(message: ContactMessage, status: 'new' | 'read' | 'replied'): Promise<void> {
    try {
      await this.contactService.updateMessageStatus(message.id!, status);
      this.snackBar.open('Message status updated', 'Close', { duration: 3000 });
      await this.loadContactMessages();
    } catch (error) {
      console.error('Error updating message status:', error);
      this.snackBar.open('Error updating message status', 'Close', { duration: 3000 });
    }
  }

  viewMessageImages(_message: ContactMessage): void {
    // TODO: Implement image viewer dialog
    this.snackBar.open('Image viewer not yet implemented', 'Close', { duration: 3000 });
  }

  replyToMessage(_message: ContactMessage): void {
    // TODO: Implement email reply functionality
    this.snackBar.open('Email reply functionality not yet implemented', 'Close', { duration: 3000 });
  }

  // Adoption Request Actions
  async updateAdoptionStatus(
    request: CalfAdoptionRequest,
    status: 'pending' | 'reviewed' | 'accepted' | 'declined'
  ): Promise<void> {
    try {
      await this.adoptionService.updateRequestStatus(request.id!, status);
      this.snackBar.open('Adoption request status updated', 'Close', { duration: 3000 });
      await this.loadAdoptionRequests();
    } catch (error) {
      console.error('Error updating adoption status:', error);
      this.snackBar.open('Error updating adoption status', 'Close', { duration: 3000 });
    }
  }

  viewAdoptionImages(_request: CalfAdoptionRequest): void {
    // TODO: Implement image viewer dialog
    this.snackBar.open('Image viewer not yet implemented', 'Close', { duration: 3000 });
  }

  replyToAdoptionRequest(_request: CalfAdoptionRequest): void {
    // TODO: Implement email reply functionality
    this.snackBar.open('Email reply functionality not yet implemented', 'Close', { duration: 3000 });
  }

  // Utility Methods
  formatDate(timestamp: any): string {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusColor(status: string): string {
    const colorMap: { [key: string]: string } = {
      new: 'primary',
      read: 'accent',
      replied: 'warn',
      pending: 'primary',
      reviewed: 'accent',
      accepted: 'warn',
      declined: ''
    };
    return colorMap[status] || '';
  }

  async logout(): Promise<void> {
    try {
      await this.authService.logout();
      this.router.navigate(['/admin/login']);
    } catch (error) {
      console.error('Logout error:', error);
      this.snackBar.open('Error logging out', 'Close', { duration: 3000 });
    }
  }
}
