import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PromotionsDTO } from '../models/promotions.dto';
import { Hotel } from '../models/hotel.model';

@Injectable({
  providedIn: 'root',
})
export class PromotionsService {
  private apiUrl = 'http://localhost:8762';

  constructor(private http: HttpClient) {}

  getPromotions(): Observable<PromotionsDTO[]> {
    return this.http.get<PromotionsDTO[]>(`${this.apiUrl}/promotionsservice/api/v1/promotions/list`);
  }

  createPromotion(hotelId: number, flightId: number): Observable<PromotionsDTO> {
    return this.http.post<PromotionsDTO>(`${this.apiUrl}/promotionsservice/api/v1/promotions/create`, null, {
      params: { hotelId: hotelId.toString(), flightId: flightId.toString() },
    });
  }

  getFlightsByCity(city: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/promotionsservice/api/v1/promotions/flights/${city}`);
  }

  getHotelsByCity(city: string): Observable<Hotel[]> {
    const params = new HttpParams().set('city', city);
    return this.http.get<Hotel[]>(`${this.apiUrl}/hotelservice/api/v1/hotels/search`, { params });
  }

  getUniqueDestinations(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/fligthservice/api/v1/flights/destinations`);
  }
  
}
