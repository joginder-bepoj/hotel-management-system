import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private readonly STORAGE_KEY = 'hotel_details';
  private readonly USER_KEY = 'user';
  private readonly API_URL = 'https://sandbox.bepoj.com/HMS/public/api';

  constructor(private http: HttpClient) { }

  saveHotelDetails(details: any): Observable<boolean> {
    try {
      // Save hotel details
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
      console.error('Error saving hotel details', e);
      return of(false);
    }
  }

  getHotelDetails(): any {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }

  addHotel(payload: any): Observable<boolean> {
    return this.http.post(`${this.API_URL}/add-hotel`, payload).pipe(
      map(response => {
        // Save to local storage as well for immediate UI updates if needed
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(payload));
        return true;
      }),
      catchError(error => {
        console.error('Error adding hotel', error);
        return of(false);
      })
    );
  }

  getMyHotel(): Observable<any> {
    return this.http.get(`${this.API_URL}/my-hotel`).pipe(
      map(response => {
        if (response) {
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(response));
        }
        return response;
      }),
      catchError(error => {
        console.error('Error fetching hotel', error);
        return of(null);
      })
    );
  }
}
