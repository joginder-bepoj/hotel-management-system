import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Router } from '@angular/router';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { HotelService } from '../../services/hotel.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatListModule, 
    MatIconModule, 
    MatMenuModule,
    MatButtonModule,
    RouterModule, 
    NgScrollbarModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Sidebar implements OnInit {
  user: any;
  activeHotel: any;
  hotels: any[] = [];

  private hotelService = inject(HotelService);
  private router = inject(Router);

  constructor() { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.loadHotels();
    
    const body = document.querySelector('body');
    if (body) {
      body.classList.add('ls-closed');
    }
  }

  loadHotels() {
    this.hotels = this.hotelService.getHotels();
    this.activeHotel = this.hotelService.getActiveHotel();
  }

  onSwitchHotel(id: string) {
    this.hotelService.setActiveHotel(id);
    this.activeHotel = this.hotelService.getActiveHotel();
    // Refresh current page or data
    window.location.reload(); 
  }

  onAddNewHotel() {
    this.router.navigate(['/setup']);
  }

  toggleMenu(event: Event) {
    event.preventDefault();
    const toggle = event.currentTarget as HTMLElement;
    const parentLi = toggle.parentElement;

    if (parentLi) {
      parentLi.classList.toggle('active');
      const subMenu = parentLi.querySelector('.submenu');
      if (subMenu) {
        if (parentLi.classList.contains('active')) {
          (subMenu as HTMLElement).style.display = 'block';
        } else {
          (subMenu as HTMLElement).style.display = 'none';
        }
      }
    }
  }
}
