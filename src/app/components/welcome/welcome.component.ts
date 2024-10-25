import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-center h-screen">
      <h1 class="text-4xl font-bold">Welcome</h1>
    </div>
  `,
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent { }
