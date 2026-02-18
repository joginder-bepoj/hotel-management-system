import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://sandbox.bepoj.com/HMS/public/api';

  constructor(private http: HttpClient) {}

  register(userData: any): Observable<any> {
    // const formData = new FormData();
    // formData.append('username', userData.username);
    // formData.append('email', userData.email);
    // formData.append('phone_number', userData.phone_number);
    // formData.append('password', userData.password);
    // formData.append('confirm_password', userData.confirm_password);
    
    // return this.http.post(`${this.baseUrl}/register`, formData);
    return of({ message: 'Registration successful', user: userData });
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
    // const formData = new FormData();
    // formData.append('email', credentials.email);
    // formData.append('password', credentials.password);
    
    // return this.http.post(`${this.baseUrl}/login`, formData);

    // Mock Login Response
    const mockUser = {
      id: 1,
      username: credentials.email.split('@')[0],
      email: credentials.email,
      phone_number: '9876543210',
      is_setup_complete: true, // Defaulting to true to access dashboard
      token: 'mock-jwt-token'
    };
    return of({ message: 'Login successful', user: mockUser });
  }
}
