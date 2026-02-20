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

  getHotels(): any[] {
    const data = localStorage.getItem(this.HOTELS_LIST_KEY);
    return data ? JSON.parse(data) : [];
  }

  getActiveHotel(): any {
    const hotels = this.getHotels();
    const activeId = localStorage.getItem(this.ACTIVE_HOTEL_ID_KEY);
    if (!activeId && hotels.length > 0) {
      return hotels[0];
    }
    return hotels.find(h => h.id === activeId) || (hotels.length > 0 ? hotels[0] : null);
  }

  setActiveHotel(id: string): void {
    localStorage.setItem(this.ACTIVE_HOTEL_ID_KEY, id);
  }

  saveHotelDetails(details: any): Observable<boolean> {
    try {
      const hotels = this.getHotels();
      const id = details.id || 'hotel_' + Date.now();
      const newHotel = { ...details, id };
      
      const index = hotels.findIndex(h => h.id === id);
      if (index > -1) {
        hotels[index] = newHotel;
      } else {
        hotels.push(newHotel);
      }

      localStorage.setItem(this.HOTELS_LIST_KEY, JSON.stringify(hotels));
      this.setActiveHotel(id);

      // Update user setup status
      const userStr = localStorage.getItem(this.USER_KEY);
      if (userStr) {
        const user = JSON.parse(userStr);
        user.isSetupComplete = true;
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
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
    // For now, save to localStorage array instead of API
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
    const hotels = this.getHotels();
    return hotels.length > 0;
  }
}
