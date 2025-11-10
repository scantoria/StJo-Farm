import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface Value {
  icon: string;
  title: string;
  description: string;
  color: string;
}

interface Animal {
  icon: string;
  name: string;
  type: string;
  description: string;
  features: string[];
}

interface Stat {
  number: string;
  label: string;
}

interface Practice {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-about',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './about.html',
  styleUrl: './about.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class About {
  farmImageExists = signal(true);

  values: Value[] = [
    {
      icon: 'favorite',
      title: 'Animal Welfare',
      description: 'Every animal receives individual care and attention. Their health and happiness is our top priority.',
      color: 'var(--color-orange)'
    },
    {
      icon: 'eco',
      title: 'Sustainability',
      description: 'We practice sustainable farming methods that respect the land and environment for future generations.',
      color: 'var(--color-badass)'
    },
    {
      icon: 'groups',
      title: 'Community Focus',
      description: 'We believe in sharing our bounty with neighbors and building strong community relationships.',
      color: 'var(--color-blue)'
    },
    {
      icon: 'verified',
      title: 'Quality Standards',
      description: 'We maintain the highest standards in everything we do, from animal care to product quality.',
      color: 'var(--color-orange-dark)'
    }
  ];

  animals: Animal[] = [
    {
      icon: 'water_drop',
      name: 'Dairy Cows',
      type: 'Permanent Residents',
      description: 'Our show dairy cows are the heart of the farm. They provide quality milk for family use and feeding our young animals.',
      features: ['Family Milk', 'Show Quality', 'Well Cared For']
    },
    {
      icon: 'agriculture',
      name: 'Calves',
      type: 'Rotating Stock',
      description: 'We receive calves throughout the year. Heifers and steers are raised with care before sale.',
      features: ['Healthy', 'Well-Fed', 'Socialized']
    },
    {
      icon: 'agriculture',
      name: 'Goats',
      type: 'For Sale',
      description: 'We raise quality wethers and does. Perfect for farms, brush clearing, or companionship.',
      features: ['Wethers', 'Does', 'Friendly']
    },
    {
      icon: 'directions_run',
      name: 'Thoroughbred Horses',
      type: 'Available',
      description: 'Beautiful thoroughbred horses with excellent bloodlines and temperament.',
      features: ['Quality Bloodlines', 'Well-Trained', 'Healthy']
    },
    {
      icon: 'egg',
      name: 'Chickens',
      type: 'Egg Producers',
      description: 'Free-range chickens providing fresh eggs daily. Happy chickens make better eggs!',
      features: ['Free Range', 'Fresh Eggs', 'Healthy Flock']
    }
  ];

  stats: Stat[] = [
    { number: '5.8', label: 'Acres' },
    { number: '100%', label: 'Family Owned' },
    { number: 'Daily', label: 'Family Milk' },
    { number: '5+', label: 'Animal Types' }
  ];

  practices: Practice[] = [
    {
      icon: 'restaurant',
      title: 'Quality Nutrition',
      description: 'All our animals receive proper nutrition tailored to their specific needs for optimal health.'
    },
    {
      icon: 'medical_services',
      title: 'Veterinary Care',
      description: 'Regular health checks and immediate medical attention ensure all animals stay healthy.'
    },
    {
      icon: 'home',
      title: 'Comfortable Housing',
      description: 'Clean, spacious living areas provide comfort and safety for all our animals.'
    },
    {
      icon: 'nature',
      title: 'Natural Environment',
      description: 'Our animals have access to pasture and outdoor areas appropriate for their species.'
    },
    {
      icon: 'cleaning_services',
      title: 'Cleanliness',
      description: 'We maintain high standards of cleanliness in all animal areas and facilities.'
    },
    {
      icon: 'people',
      title: 'Socialization',
      description: 'Regular interaction with people ensures our animals are well-socialized and friendly.'
    }
  ];
}
