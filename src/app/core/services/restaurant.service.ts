import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private readonly STORAGE_KEY = 'restaurant_details';
  private readonly USER_KEY = 'user';

  constructor() { }

  saveRestaurantDetails(details: any): Observable<boolean> {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(details));
      
      // Update user setup status
      const userStr = localStorage.getItem(this.USER_KEY);
      if (userStr) {
        const user = JSON.parse(userStr);
        user.isSetupComplete = true;
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      }
      
      return of(true);
    } catch (e) {
      console.error('Error saving restaurant details', e);
      return of(false);
    }
  }

  getRestaurantDetails(): any {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }
}
