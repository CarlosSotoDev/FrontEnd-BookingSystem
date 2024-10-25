import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HotelService } from '../../services/hotel.service';
import { Hotel } from '../../models/hotel.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-hotels',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.scss'],
})
export class HotelsComponent implements OnInit {
  hotels: Hotel[] = [];
  isLoading: boolean = false;

  // Variables para búsqueda
  searchHotelName: string = '';
  searchCity: string = '';

  // Variables para modal de creación
  showCreateModal: boolean = false;
  newHotel: Partial<Hotel> = {
    hotelName: '',
    city: '',
    checkinDate: '',
    pricePerNight: 0,
  };

  // Variables para modal de edición
  showEditModal: boolean = false;
  selectedHotel: Partial<Hotel> = {
    id: undefined,
    hotelName: '',
    city: '',
    checkinDate: '',
    pricePerNight: 0,
  };

  constructor(private hotelService: HotelService) {}

  ngOnInit(): void {
    this.fetchHotels();
  }

  async fetchHotels() {
    this.isLoading = true;
    try {
      this.hotels = await firstValueFrom(this.hotelService.getAllHotels());
      this.isLoading = false;
    } catch (error) {
      console.error('Error fetching hotels:', error);
      this.isLoading = false;
    }
  }

  async searchHotels() {
    this.isLoading = true;
    try {
      this.hotels = await firstValueFrom(
        this.hotelService.searchHotels(this.searchHotelName, this.searchCity)
      );
      this.isLoading = false;
    } catch (error) {
      console.error('Error searching hotels:', error);
      this.isLoading = false;
    }
  }

  // Abrir modal de creación
  openCreateModal() {
    this.showCreateModal = true;
    this.newHotel = {
      hotelName: '',
      city: '',
      checkinDate: '',
      pricePerNight: 0,
    };
  }

  // Cerrar modal de creación
  closeCreateModal() {
    this.showCreateModal = false;
  }

  // Crear nuevo hotel
  async createHotel() {
    try {
      const createdHotel = await firstValueFrom(this.hotelService.createHotel(this.newHotel as Hotel));
      this.hotels.push(createdHotel); // Agregar el nuevo hotel a la lista
      this.closeCreateModal(); // Cerrar el modal después de crear
      alert('El hotel fue creado con éxito.');
    } catch (error) {
      console.error('Error creating hotel:', error);
    }
  }

  // Abrir modal de edición
  openEditModal(hotel: Hotel) {
    this.selectedHotel = { ...hotel }; // Copiar los datos del hotel seleccionado
    this.showEditModal = true;
  }

  // Cerrar modal de edición
  closeEditModal() {
    this.showEditModal = false; // Cerrar el modal
    this.selectedHotel = { // Limpiar el objeto seleccionado
      id: 0,
      hotelName: '',
      city: '',
      checkinDate: '',
      pricePerNight: 0,
    };
  }

  // Actualizar hotel
  async updateHotel() {
    if (this.selectedHotel.id !== undefined) {
      try {
        // Enviamos la petición de actualización al backend
        const updatedHotel = await firstValueFrom(
          this.hotelService.updateHotel(this.selectedHotel.id, this.selectedHotel as Hotel)
        );
  
        if (updatedHotel) {
          // Actualizamos la lista de hoteles localmente con los datos actualizados
          const index = this.hotels.findIndex(h => h.id === this.selectedHotel.id);
          if (index !== -1) {
            this.hotels[index] = updatedHotel; // Actualizamos el hotel en la lista
          }
  
          // Mostramos una alerta de éxito
          alert('El hotel fue actualizado con éxito.');
  
          // Cerramos el modal
          this.closeEditModal(); // Cerrar el modal después de actualizar
        }
      } catch (error: any) {
        console.error('Error actualizando el hotel:', error);
  
        // Cerramos el modal incluso si hubo un error
        this.closeEditModal();
  
        // Verificamos si el error tiene un estatus
        if (error.status && error.status !== 200) {
          alert('Hubo un problema actualizando el hotel.');
        }
      }
    } else {
      console.error('El ID del hotel es indefinido');
    }
  }
  
  
  

  // Eliminar hotel
  async deleteHotel(hotelId: number) {
    try {
      const response = await firstValueFrom(this.hotelService.deleteHotel(hotelId));
      if (response.status === 204 || response.status === 200) {
        this.hotels = this.hotels.filter((hotel) => hotel.id !== hotelId);
        alert('El hotel fue eliminado con éxito.'); // Alerta al eliminar
      } else {
        console.error('No se pudo eliminar el hotel.');
      }
    } catch (error) {
      console.error('Error eliminando el hotel:', error);
    }
  }
}
