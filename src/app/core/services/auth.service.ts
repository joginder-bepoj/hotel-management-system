import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://sandbox.bepoj.com/HMS/public/api';

  constructor(private http: HttpClient) {}

  register(userData: any): Observable<any> {
    const formData = new FormData();
    formData.append('username', userData.username);
    formData.append('email', userData.email);
    formData.append('phone_number', userData.phone_number);
    formData.append('password', userData.password);
    formData.append('confirm_password', userData.confirm_password);
    
    return this.http.post(`${this.baseUrl}/register`, formData);
  }

  verifyOtp(email: string, otp: string): Observable<any> {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('otp', otp);
    
    return this.http.post(`${this.baseUrl}/verifyotp`, formData);
  }

  resendOtp(email: string): Observable<any> {
    const formData = new FormData();
    formData.append('email', email);
    
    return this.http.post(`${this.baseUrl}/resendotp`, formData);
  }

  login(credentials: any): Observable<any> {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    
    return this.http.post(`${this.baseUrl}/login`, formData);
  }
}
