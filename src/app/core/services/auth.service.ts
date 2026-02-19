import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://sandbox.bepoj.com/HMS/public/api';

  constructor(private http: HttpClient) {}

  register(userData: any): Observable<any> {
    // For mock purposes, save user to localStorage "database"
    const registeredUsers = JSON.parse(localStorage.getItem('hms_registered_users') || '[]');
    
    // Check if user already exists
    if (registeredUsers.find((u: any) => u.email === userData.email)) {
      return of({ message: 'User already exists', success: false }).pipe(
        map(res => { throw { error: res }; })
      );
    }

    const newUser = {
      ...userData,
      id: registeredUsers.length + 1,
      is_setup_complete: false
    };
    
    registeredUsers.push(newUser);
    localStorage.setItem('hms_registered_users', JSON.stringify(registeredUsers));
    
    return of({ message: 'Registration successful', user: newUser });
  }

  verifyOtp(email: string, otp: string): Observable<any> {
    // const formData = new FormData();
    // formData.append('email', email);
    // formData.append('otp', otp);
    
    // return this.http.post(`${this.baseUrl}/verifyotp`, formData);
    return of({ message: 'OTP Verified', success: true });
  }

  resendOtp(email: string): Observable<any> {
    // const formData = new FormData();
    // formData.append('email', email);
    
    // return this.http.post(`${this.baseUrl}/resendotp`, formData);
    return of({ message: 'OTP Resent', success: true });
  }

  login(credentials: any): Observable<any> {
    // Check against mock "database"
    const registeredUsers = JSON.parse(localStorage.getItem('hms_registered_users') || '[]');
    const user = registeredUsers.find((u: any) => u.email === credentials.email);

    if (!user) {
      // User doesn't exist
      return of({ 
        message: 'No account found with this email. Please sign up first.', 
        error: true 
      }).pipe(
        map(res => { 
          // Throw error so it's caught by the component's error handler
          const errorObj = { error: { message: res.message } };
          throw errorObj;
        })
      );
    }

    if (user.password !== credentials.password) {
      return of({ 
        message: 'Invalid password', 
        error: true 
      }).pipe(
        map(() => { throw { error: { message: 'Invalid credentials' } }; })
      );
    }

    // Check if hotel setup is complete (check across both user object and localStorage)
    const activeHotels = JSON.parse(localStorage.getItem('hms_hotels_list') || '[]');
    user.is_setup_complete = activeHotels.length > 0;

    return of({ message: 'Login successful', user: user });
  }
}
