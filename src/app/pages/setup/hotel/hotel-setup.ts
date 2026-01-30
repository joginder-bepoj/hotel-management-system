
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hotel-setup',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 2rem; text-align: center;">
      <h1>Hotel Setup Flow</h1>
      <p>This is where the hotel setup wizard will go.</p>
    </div>
  `
})
export class HotelSetupComponent {}
