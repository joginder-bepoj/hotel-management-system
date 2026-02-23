import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private readonly HOTELS_LIST_KEY = 'hms_hotels_list';
  private readonly ACTIVE_HOTEL_ID_KEY = 'hms_active_hotel_id';
  private readonly USER_KEY = 'user';
  private readonly API_URL = 'https://sandbox.bepoj.com/HMS/public/api';

  constructor(private http: HttpClient) { }

  private getActiveHotelIdKey(userId: number): string {
    return `${this.ACTIVE_HOTEL_ID_KEY}_${userId}`;
  }

  getHotels(userId?: number): any[] {
    const data = localStorage.getItem(this.HOTELS_LIST_KEY);
    const hotels = data ? JSON.parse(data) : [];
    if (userId) {
      return hotels.filter((h: any) => h.user_id === userId);
    }
    return hotels;
  }

  private getCurrentUser(): any {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  getActiveHotel(): any {
    const user = this.getCurrentUser();
    if (!user) return null;
    
    const hotels = this.getHotels(user.id);
    const activeId = localStorage.getItem(this.getActiveHotelIdKey(user.id));
    
    if (hotels.length === 0) return null;
    
    const activeHotel = hotels.find(h => h.id === activeId);
    return activeHotel || hotels[0];
  }

  setActiveHotel(id: string): void {
    const user = this.getCurrentUser();
    if (user) {
      localStorage.setItem(this.getActiveHotelIdKey(user.id), id);
    }
  }

  saveHotelDetails(details: any): Observable<boolean> {
    try {
      const user = this.getCurrentUser();
      if (!user) return of(false);

      const allHotelsStr = localStorage.getItem(this.HOTELS_LIST_KEY);
      const allHotels = allHotelsStr ? JSON.parse(allHotelsStr) : [];
      
      const id = details.id || 'hotel_' + Date.now();
      // Ensure user_id is set
      const newHotel = { ...details, id, user_id: user.id };
      
      const index = allHotels.findIndex((h: any) => h.id === id);
      if (index > -1) {
        allHotels[index] = newHotel;
      } else {
        allHotels.push(newHotel);
      }

      localStorage.setItem(this.HOTELS_LIST_KEY, JSON.stringify(allHotels));
      this.setActiveHotel(id);

      // Update user setup status in both session and persistent storage
      user.is_setup_complete = true;
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      
      const registeredUsers = JSON.parse(localStorage.getItem('hms_registered_users') || '[]');
      const uIndex = registeredUsers.findIndex((u: any) => u.id === user.id);
      if (uIndex > -1) {
        registeredUsers[uIndex].is_setup_complete = true;
        localStorage.setItem('hms_registered_users', JSON.stringify(registeredUsers));
      }
      
      return of(true);
    } catch (e) {
      console.error('Error saving hotel details', e);
      return of(false);
    }
  }

  // Legacy for compatibility if needed elsewhere
  getHotelDetails(): any {
    return this.getActiveHotel();
  }

  addHotel(payload: any): Observable<boolean> {
    const hotelObj: any = {};
    if (payload instanceof FormData) {
      payload.forEach((value, key) => {
        hotelObj[key] = value;
      });
    } else {
      Object.assign(hotelObj, payload);
    }
    
    return this.saveHotelDetails(hotelObj);
  }

  getMyHotel(): Observable<any> {
    return of(this.getActiveHotel());
  }

  isSetupComplete(): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    // Check both the user flag and the actual hotels list for safety
    if (user.is_setup_complete) return true;
    
    const hotels = this.getHotels(user.id);
    return hotels.length > 0;
  }
}
