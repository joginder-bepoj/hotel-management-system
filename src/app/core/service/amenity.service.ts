import { Injectable } from '@angular/core';

export interface Amenity {
  id: number;
  name: string;
  icon?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AmenityService {
  private amenities: Amenity[] = [
    { id: 1, name: 'Free Wi-Fi', icon: 'wifi' },
    { id: 2, name: 'Swimming Pool', icon: 'pool' },
    { id: 3, name: 'Gym', icon: 'fitness_center' },
    { id: 4, name: 'Parking', icon: 'local_parking' },
    { id: 5, name: 'Restaurant', icon: 'restaurant' },
    { id: 6, name: 'Air Conditioning', icon: 'ac_unit' },
  ];

  constructor() {}

  getAmenities(): Amenity[] {
    return [...this.amenities];
  }

  addAmenity(amenity: Omit<Amenity, 'id'>): void {
    const newId = this.amenities.length > 0 ? Math.max(...this.amenities.map(a => a.id)) + 1 : 1;
    this.amenities.push({ ...amenity, id: newId });
  }

  deleteAmenity(id: number): void {
    this.amenities = this.amenities.filter(a => a.id !== id);
  }
}
