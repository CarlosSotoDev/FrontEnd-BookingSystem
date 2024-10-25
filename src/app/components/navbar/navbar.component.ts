import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',  // Cambia la referencia al archivo HTML
  imports: [RouterModule],
  standalone: true,
})
export class NavbarComponent {}
