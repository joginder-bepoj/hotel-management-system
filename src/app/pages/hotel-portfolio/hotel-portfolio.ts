import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HotelService } from '../../core/services/hotel.service';

@Component({
  selector: 'app-hotel-portfolio',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './hotel-portfolio.html',
  styleUrls: ['./hotel-portfolio.scss']
})
export class HotelPortfolioComponent implements OnInit {
  private hotelService = inject(HotelService);
  private router = inject(Router);
  
  hotels: any[] = [];
  activeHotelId: string | null = null;
  
  ngOnInit() {
    this.hotels = this.hotelService.getHotels();
    const active = this.hotelService.getActiveHotel();
    this.activeHotelId = active ? active.id : null;

    // For demo purposes, if hotels don't have mock metrics, we add them
    this.hotels = this.hotels.map(hotel => ({
      ...hotel,
      checkIns: Math.floor(Math.random() * 20) + 5,
      checkOuts: Math.floor(Math.random() * 15) + 3,
      sales: Math.floor(Math.random() * 50000) + 15000,
      occupancy: Math.floor(Math.random() * 40) + 60
    }));
  }
  
  selectHotel(id: string) {
    this.hotelService.setActiveHotel(id);
    this.router.navigate(['/dashboard']);
  }
  
  addHotel() {
    this.router.navigate(['/setup/hotel']);
  }
}
