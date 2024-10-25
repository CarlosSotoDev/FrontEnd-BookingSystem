import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hotel } from '../models/hotel.model';

@Injectable({
  providedIn: 'root',
})
export class HotelService {
  private apiUrl = 'http://localhost:8762/hotelservice/api/v1/hotels';

  constructor(private http: HttpClient) {}

  // Obtener todos los hoteles
  getAllHotels(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(this.apiUrl);
  }

  // Crear un nuevo hotel
  createHotel(hotel: Hotel): Observable<Hotel> {
    return this.http.post<Hotel>(this.apiUrl, hotel);
  }

  // Eliminar un hotel
  deleteHotel(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { observe: 'response' });
  }

  // Buscar hoteles con filtros opcionales
  searchHotels(
    hotelName?: string,
    city?: string,
    startDate?: string,
    endDate?: string,
    minPrice?: string,
    maxPrice?: string
  ): Observable<Hotel[]> {
    let params = new HttpParams();
    
    // Añadir parámetros a la búsqueda si están presentes
    if (hotelName) params = params.set('hotelName', hotelName);
    if (city) params = params.set('city', city);
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);
    if (minPrice) params = params.set('minPrice', minPrice);
    if (maxPrice) params = params.set('maxPrice', maxPrice);

    return this.http.get<Hotel[]>(`${this.apiUrl}/search`, { params });
  }

  // Actualizar un hotel existente
  updateHotel(id: number, hotel: Hotel): Observable<Hotel> {
    return this.http.put<Hotel>(`${this.apiUrl}/${id}`, hotel);
  }
  
}
