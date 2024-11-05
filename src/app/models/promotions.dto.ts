import { Hotel } from './hotel.model';
import { Flight } from './flight.model';

export interface PromotionsDTO {
  hotel: Hotel;
  flight: Flight;
  totalPrice3Nights: number;
  totalPrice5Nights: number;
}