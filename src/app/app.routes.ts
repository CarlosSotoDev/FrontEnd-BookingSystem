import { Routes } from '@angular/router';
import { HotelsComponent } from './components/hotels/hotels.component';
import { FlightsComponent } from './components/flights/flights.component'; 
import { WelcomeComponent } from './components/welcome/welcome.component';

export const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'hotels', component: HotelsComponent },
  { path: 'flights', component: FlightsComponent }, 
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
