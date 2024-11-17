import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PromotionsService } from '../../services/promotions.service';
import { PromotionsDTO } from '../../models/promotions.dto';
import { Hotel } from '../../models/hotel.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.scss'],
  standalone: true,
  providers: [PromotionsService],
  imports: [FormsModule, CommonModule],
})
export class PromotionsComponent implements OnInit {
  promotions: PromotionsDTO[] = [];
  cities: string[] = [];
  hotels: Hotel[] = [];
  selectedCity: string = '';
  selectedHotelId?: number;
  showCreateModal = false;
  searchHotelName: string = '';
  searchDestination: string = '';

  constructor(private promotionsService: PromotionsService) {}

  async ngOnInit(): Promise<void> {
    await this.loadPromotions();
  }

  async loadPromotions(): Promise<void> {
    try {
      this.promotions = await firstValueFrom(this.promotionsService.getPromotions());
      console.log('Promotions loaded:', this.promotions);
    } catch (error) {
      console.error('Error loading promotions:', error);
    }
  }

  async loadCities(): Promise<void> {
    try {
      this.cities = await firstValueFrom(this.promotionsService.getUniqueDestinations());
      console.log('Cities loaded:', this.cities);
    } catch (error) {
      console.error('Error loading destinations:', error);
    }
  }

  async filterHotelsByCity(): Promise<void> {
    if (this.selectedCity) {
      try {
        this.hotels = await firstValueFrom(this.promotionsService.getHotelsByCity(this.selectedCity));
        console.log(`Hotels for city ${this.selectedCity}:`, this.hotels);
      } catch (error) {
        console.error('Error loading hotels by city:', error);
      }
    } else {
      this.hotels = [];
    }
  }

  async openCreateModal(): Promise<void> {
    try {
      await this.loadCities();
      this.showCreateModal = true;
      this.selectedCity = '';
      this.selectedHotelId = undefined;
    } catch (error) {
      console.error('Error opening create modal:', error);
    }
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  async createPromotion(): Promise<void> {
    console.log('Selected Hotel ID:', this.selectedHotelId);
    const flightId = 1; // Placeholder ID; adjust if necessary
    console.log('Flight ID:', flightId);

    if (!this.selectedHotelId) {
      alert('Please select a valid hotel.');
      return;
    }

    try {
      const newPromotion = await firstValueFrom(
        this.promotionsService.createPromotion(this.selectedHotelId, flightId)
      );
      console.log('Promotion created successfully:', newPromotion);
      this.promotions.push(newPromotion);
      this.closeCreateModal();
      alert('Promotion created successfully');
    } catch (error) {
      console.error('Error creating promotion:', error);
      alert('Failed to create promotion. Please check the backend and logs.');
    }
  }

  searchPromotions(): void {
    this.promotions = this.promotions.filter(promotion =>
      promotion.hotel.hotelName.includes(this.searchHotelName) &&
      promotion.flight.destination.includes(this.searchDestination)
    );
  }
}
