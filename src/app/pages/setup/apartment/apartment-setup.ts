
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-apartment-setup',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 2rem; text-align: center;">
      <h1>Apartment Setup Flow</h1>
      <p>This is where the apartment setup wizard will go.</p>
    </div>
  `
})
export class ApartmentSetupComponent {}
