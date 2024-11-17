import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightService } from '../../services/flight.service';
import { Flight } from '../../models/flight.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-flights',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.scss'],
})
export class FlightsComponent implements OnInit {
  flights: Flight[] = [];
  displayedFlights: Flight[] = []; // Vuelos que se muestran en la tabla
  isLoading: boolean = false;

  // Variables para búsqueda
  searchCityOrigin: string = '';
  searchDestination: string = '';

  // Variables para modal de creación
  showCreateModal: boolean = false;
  newFlight: Flight = {
    id: 0,
    cityOrigin: '',
    destination: '',
    departureDate: '',
    departureTime: '',
    price: 0,
  };

  // Variables para modal de edición
  showEditModal: boolean = false;
  selectedFlight: Flight = {
    id: 0,
    cityOrigin: '',
    destination: '',
    departureDate: '',
    departureTime: '',
    price: 0,
  };

  // Variables de paginación
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;

  constructor(private flightService: FlightService) {}

  ngOnInit(): void {
    this.fetchFlights();
  }

  async fetchFlights() {
    this.isLoading = true;
    try {
      const allFlights = await firstValueFrom(this.flightService.getAllFlights());
      this.flights = allFlights;
      this.totalPages = Math.ceil(this.flights.length / this.itemsPerPage);
      this.updateDisplayedFlights();
    } catch (error) {
      console.error('Error fetching flights:', error);
    } finally {
      this.isLoading = false;
    }
  }

  updateDisplayedFlights() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.displayedFlights = this.flights.slice(start, end);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedFlights();
    }
  }

  async searchFlights() {
    this.isLoading = true;
    try {
      const allFlights = await firstValueFrom(
        this.flightService.searchFlights(this.searchCityOrigin, this.searchDestination)
      );
      this.flights = allFlights;
      this.totalPages = Math.ceil(this.flights.length / this.itemsPerPage);
      this.currentPage = 1;
      this.updateDisplayedFlights();
    } catch (error) {
      console.error('Error searching flights:', error);
    } finally {
      this.isLoading = false;
    }
  }

  openCreateModal() {
    this.showCreateModal = true;
    this.newFlight = {
      id: 0,
      cityOrigin: '',
      destination: '',
      departureDate: '',
      departureTime: '',
      price: 0,
    };
  }

  closeCreateModal() {
    this.showCreateModal = false;
  }

  async createFlight() {
    try {
      const createdFlight = await firstValueFrom(this.flightService.createFlight(this.newFlight));
      this.flights.push(createdFlight);
      this.totalPages = Math.ceil(this.flights.length / this.itemsPerPage);
      this.updateDisplayedFlights();
      this.closeCreateModal();
      alert('El vuelo se creó correctamente.');
    } catch (error) {
      console.error('Error creando el vuelo:', error);
    }
  }

  openEditModal(flight: Flight) {
    this.selectedFlight = { ...flight };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedFlight = {
      id: 0,
      cityOrigin: '',
      destination: '',
      departureDate: '',
      departureTime: '',
      price: 0,
    };
  }

  async updateFlight() {
    if (this.selectedFlight.id !== undefined) {
      try {
        const updatedFlight = await firstValueFrom(
          this.flightService.updateFlight(this.selectedFlight.id, this.selectedFlight)
        );
        const index = this.flights.findIndex(flight => flight.id === this.selectedFlight.id);
        if (index !== -1) {
          this.flights[index] = updatedFlight;
        }
        this.updateDisplayedFlights();
        this.closeEditModal();
        alert('El vuelo se actualizó correctamente.');
      } catch (error) {
        console.error('Error actualizando el vuelo:', error);
      }
    }
  }

  async deleteFlight(flightId?: number) {
    if (flightId !== undefined) {
      try {
        const response = await firstValueFrom(this.flightService.deleteFlight(flightId));
        if (response.status === 204 || response.status === 200) {
          this.flights = this.flights.filter(flight => flight.id !== flightId);
          this.totalPages = Math.ceil(this.flights.length / this.itemsPerPage);
          this.updateDisplayedFlights();
          alert('El vuelo fue eliminado exitosamente.');
        }
      } catch (error) {
        console.error('Error eliminando el vuelo:', error);
      }
    }
  }
}
