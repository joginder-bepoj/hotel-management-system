import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { HotelService } from '../../core/services/hotel.service';
import { ApartmentService } from '../../core/services/apartment.service';
import { RestaurantService } from '../../core/services/restaurant.service';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatIconModule, 
    MatDividerModule, 
    MatChipsModule,
    BreadcrumbComponent
  ],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class ProfileComponent implements OnInit {
  user: any;
  hotelDetails: any;
  apartmentDetails: any;
  restaurantDetails: any;

  constructor(
    private hotelService: HotelService,
    private apartmentService: ApartmentService,
    private restaurantService: RestaurantService
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.loadSetupDetails();
  }

  loadSetupDetails(): void {
    this.hotelDetails = this.hotelService.getHotelDetails();
    this.apartmentDetails = this.apartmentService.getApartmentDetails();
    this.restaurantDetails = this.restaurantService.getRestaurantDetails();
  }

  get hasProperty(): boolean {
    return !!(this.hotelDetails || this.apartmentDetails || this.restaurantDetails);
  }

  get amenityList(): string[] {
    if (!this.hotelDetails) return [];
    
    const amenities = [];
    if (this.hotelDetails.amenityWifi) amenities.push('Free Wi-Fi');
    if (this.hotelDetails.amenityParking) amenities.push('Parking');
    if (this.hotelDetails.amenityPool) amenities.push('Swimming Pool');
    if (this.hotelDetails.amenityGym) amenities.push('Gym');
    if (this.hotelDetails.amenityRestaurant) amenities.push('Restaurant');
    if (this.hotelDetails.amenityRoomService) amenities.push('Room Service');
    
    return amenities;
  }

  get facilityList(): string[] {
    if (!this.apartmentDetails) return [];
    
    const facilities = [];
    if (this.apartmentDetails.facilityWifi) facilities.push('Wi-Fi');
    if (this.apartmentDetails.facilityParking) facilities.push('Parking');
    if (this.apartmentDetails.facilityAc) facilities.push('AC');
    if (this.apartmentDetails.facilityKitchen) facilities.push('Kitchen');
    if (this.apartmentDetails.facilityTv) facilities.push('TV');
    if (this.apartmentDetails.facilityWashingMachine) facilities.push('Washing Machine');
    
    return facilities;
  }
}
