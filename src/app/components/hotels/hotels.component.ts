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
  displayedHotels: Hotel[] = [];
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

  // Variables de paginación
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;

  constructor(private hotelService: HotelService) {}

  ngOnInit(): void {
    this.fetchHotels();
  }

  async fetchHotels() {
    this.isLoading = true;
    try {
      this.hotels = await firstValueFrom(this.hotelService.getAllHotels());
      this.totalPages = Math.ceil(this.hotels.length / this.itemsPerPage);
      this.updateDisplayedHotels();
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      this.isLoading = false;
    }
  }

  updateDisplayedHotels() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.displayedHotels = this.hotels.slice(start, end);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedHotels();
    }
  }

  async searchHotels() {
    this.isLoading = true;
    try {
      // Obtener todos los hoteles desde el backend
      const allHotels = await firstValueFrom(this.hotelService.getAllHotels());
      
      // Filtrar en el frontend usando coincidencias parciales
      const searchName = this.searchHotelName.toLowerCase();
      const searchCity = this.searchCity.toLowerCase();
  
      this.hotels = allHotels.filter(hotel => {
        const matchesName = hotel.hotelName?.toLowerCase().includes(searchName); // Verificar coincidencias en el nombre
        const matchesCity = hotel.city?.toLowerCase().includes(searchCity);     // Verificar coincidencias en la ciudad
        return matchesName || matchesCity; // Incluir si coincide con cualquiera de los dos
      });
  
      // Actualizar la paginación después de filtrar
      this.totalPages = Math.ceil(this.hotels.length / this.itemsPerPage);
      this.currentPage = 1;
      this.updateDisplayedHotels();
    } catch (error) {
      console.error('Error searching hotels:', error);
    } finally {
      this.isLoading = false;
    }
  }
  
  

  openCreateModal() {
    this.showCreateModal = true;
    this.newHotel = {
      hotelName: '',
      city: '',
      checkinDate: '',
      pricePerNight: 0,
    };
  }

  closeCreateModal() {
    this.showCreateModal = false;
  }

  async createHotel() {
    try {
      const createdHotel = await firstValueFrom(
        this.hotelService.createHotel(this.newHotel as Hotel)
      );
      this.hotels.push(createdHotel);
      this.totalPages = Math.ceil(this.hotels.length / this.itemsPerPage);
      this.updateDisplayedHotels();
      this.closeCreateModal();
      alert('El hotel fue creado con éxito.');
    } catch (error) {
      console.error('Error creating hotel:', error);
    }
  }

  openEditModal(hotel: Hotel) {
    this.selectedHotel = { ...hotel }; // Copia los datos del hotel seleccionado
    this.showEditModal = true; // Muestra el modal de edición
  }

  closeEditModal() {
    this.showEditModal = false; // Cierra el modal de edición
    this.selectedHotel = {
      // Resetea los datos del hotel seleccionado
      id: undefined,
      hotelName: '',
      city: '',
      checkinDate: '',
      pricePerNight: 0,
    };
  }

  async updateHotel() {
    if (this.selectedHotel.id !== undefined) {
      try {
        const updatedHotel = await firstValueFrom(
          this.hotelService.updateHotel(
            this.selectedHotel.id,
            this.selectedHotel as Hotel
          )
        );
        if (updatedHotel) {
          const index = this.hotels.findIndex(
            (h) => h.id === this.selectedHotel.id
          );
          if (index !== -1) {
            this.hotels[index] = updatedHotel;
          }
          this.updateDisplayedHotels();
          alert('El hotel fue actualizado con éxito.');
        }
      } catch (error) {
        console.error('Error actualizando el hotel:', error);
        alert('Hubo un problema actualizando el hotel.');
      } finally {
        this.closeEditModal();
      }
    }
  }

  async deleteHotel(hotelId: number | undefined) {
    if (hotelId !== undefined) {
      try {
        const response = await firstValueFrom(
          this.hotelService.deleteHotel(hotelId)
        );
        if (response.status === 204 || response.status === 200) {
          this.hotels = this.hotels.filter((hotel) => hotel.id !== hotelId);
          this.totalPages = Math.ceil(this.hotels.length / this.itemsPerPage);
          this.updateDisplayedHotels();
          alert('El hotel fue eliminado con éxito.');
        }
      } catch (error) {
        console.error('Error eliminando el hotel:', error);
        alert('Hubo un problema eliminando el hotel.');
      }
    } else {
      alert('No se puede eliminar el hotel porque no tiene un ID válido.');
    }
  }
}
