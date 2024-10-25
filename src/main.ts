import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router'; // Proveer el enrutamiento
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes'; // Importa tus rutas

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(), // Proveer HttpClient para las solicitudes HTTP
    provideRouter(routes), // Proveer las rutas definidas en app.routes.ts
  ],
}).catch(err => console.error(err));
