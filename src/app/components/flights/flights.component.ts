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

  constructor(private flightService: FlightService) {}

  ngOnInit(): void {
    this.fetchFlights();
  }

  async fetchFlights() {
    this.isLoading = true;
    try {
      this.flights = await firstValueFrom(this.flightService.getAllFlights());
      this.isLoading = false;
    } catch (error) {
      console.error('Error fetching flights:', error);
      this.isLoading = false;
    }
  }

  async searchFlights() {
    this.isLoading = true;
    try {
      this.flights = await firstValueFrom(
        this.flightService.searchFlights(this.searchCityOrigin, this.searchDestination)
      );
      this.isLoading = false;
    } catch (error) {
      console.error('Error searching flights:', error);
      this.isLoading = false;
    }
  }

  // Abrir modal de creación
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

  // Cerrar modal de creación
  closeCreateModal() {
    this.showCreateModal = false;
  }

  // Crear nuevo vuelo
  async createFlight() {
    try {
      const createdFlight = await firstValueFrom(this.flightService.createFlight(this.newFlight));
      this.flights.push(createdFlight); // Agregar el nuevo vuelo a la lista
      this.closeCreateModal(); // Cerrar el modal
      alert('El vuelo se creó correctamente.'); // Mostrar una alerta de éxito
    } catch (error) {
      console.error('Error creando el vuelo:', error);
      alert('Hubo un problema creando el vuelo.');
    }
  }

  // Abrir modal de edición
  openEditModal(flight: Flight) {
    this.selectedFlight = { ...flight }; // Copiar los datos del vuelo
    this.showEditModal = true;
  }

  // Cerrar modal de edición
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

  // Actualizar vuelo
  async updateFlight() {
    if (this.selectedFlight.id !== undefined) {  // Verificamos que el ID no sea undefined
      try {
        const updatedFlight = await firstValueFrom(
          this.flightService.updateFlight(this.selectedFlight.id, this.selectedFlight)
        );
        this.closeEditModal();
        alert('El vuelo se actualizó correctamente.');
      } catch (error) {
        console.error('Error actualizando el vuelo:', error);
        alert('Hubo un problema actualizando el vuelo.');
      }
    } else {
      alert('Error: El ID del vuelo no está definido.');
    }
  }

  // Eliminar vuelo
  async deleteFlight(flightId?: number) {  // Hacemos que el parámetro sea opcional
    if (flightId !== undefined) {  // Verificamos que el ID no sea undefined
      try {
        const response = await firstValueFrom(this.flightService.deleteFlight(flightId));
        if (response.status === 204 || response.status === 200) {
          this.flights = this.flights.filter((flight) => flight.id !== flightId);
          alert('El vuelo fue eliminado exitosamente.');
        } else {
          console.error('No se pudo eliminar el vuelo.');
        }
      } catch (error) {
        console.error('Error eliminando el vuelo:', error);
      }
    } else {
      alert('Error: El ID del vuelo no está definido.');
    }
  }
}
