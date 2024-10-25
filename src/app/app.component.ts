import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, NavbarComponent], // Asegúrate de incluir aquí el RouterOutlet y el NavbarComponent
  standalone: true,
})
export class AppComponent {
  title = 'hotel-booking';
}