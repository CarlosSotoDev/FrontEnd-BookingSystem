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
    this.promotions = await firstValueFrom(this.promotionsService.getPromotions());
  }

  async loadCities(): Promise<void> {
    try {
      this.cities = await firstValueFrom(this.promotionsService.getUniqueDestinations());
    } catch (error) {
      console.error('Error loading destinations:', error);
    }
  }

  async filterHotelsByCity(): Promise<void> {
    if (this.selectedCity) {
      try {
        this.hotels = await firstValueFrom(this.promotionsService.getHotelsByCity(this.selectedCity));
      } catch (error) {
        console.error('Error loading hotels by city:', error);
      }
    } else {
      this.hotels = [];
    }
  }

  async openCreateModal(): Promise<void> {
    await this.loadCities(); // Asegura cargar las ciudades antes de mostrar el modal
    this.showCreateModal = true;
    this.selectedCity = '';
    this.selectedHotelId = undefined;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  async createPromotion(): Promise<void> {
    if (this.selectedHotelId) {
      const flightId = 1; // Asume que tienes el id de vuelo correcto
      try {
        const newPromotion = await firstValueFrom(
          this.promotionsService.createPromotion(this.selectedHotelId, flightId)
        );
        this.promotions.push(newPromotion);
        this.closeCreateModal();
        alert('Promotion created successfully');
      } catch (error) {
        console.error('Error creating promotion:', error);
      }
    }
  }

  searchPromotions(): void {
    this.promotions = this.promotions.filter(promotion =>
      promotion.hotel.hotelName.includes(this.searchHotelName) &&
      promotion.flight.destination.includes(this.searchDestination)
    );
  }
}
