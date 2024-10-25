import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Flight } from '../models/flight.model';

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  private apiUrl = 'http://localhost:8762/fligthservice/api/v1/flights';

  constructor(private http: HttpClient) {}

  getAllFlights(): Observable<Flight[]> {
    return this.http.get<Flight[]>(this.apiUrl);
  }

  createFlight(flight: Flight): Observable<Flight> {
    return this.http.post<Flight>(this.apiUrl, flight);
  }

  deleteFlight(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { observe: 'response' });
  }

  searchFlights(
    cityOrigin?: string,
    destination?: string,
    startDate?: string,
    endDate?: string,
    departureTime?: string,
    minPrice?: string,
    maxPrice?: string
  ): Observable<Flight[]> {
    let params = new HttpParams();

    if (cityOrigin) params = params.set('cityOrigin', cityOrigin);
    if (destination) params = params.set('destination', destination);
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);
    if (departureTime) params = params.set('departureTime', departureTime);
    if (minPrice) params = params.set('minPrice', minPrice);
    if (maxPrice) params = params.set('maxPrice', maxPrice);

    return this.http.get<Flight[]>(`${this.apiUrl}/search`, { params });
  }

  updateFlight(id: number, flight: Flight): Observable<Flight> {
    return this.http.put<Flight>(`${this.apiUrl}/${id}`, flight);
  }
}
