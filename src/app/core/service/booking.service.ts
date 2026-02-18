import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Booking {
  id: number;
  first: string;
  last: string;
  email: string;
  gender: string;
  mobile: string;
  city: string;
  arriveDate: Date;
  departDate: Date;
  totalPerson: number;
  roomType: string;
  address: string;
  uploadFile: string;
  note: string;
  payment: string;
  roomNo?: string;
  vehicleNo?: string;
  nationality?: string;
  purpose?: string;
  passportNo?: string;
  arrivalFrom?: string;
  departureTo?: string;
  noOfAdults?: number;
  noOfChildren?: number;
  accompanying?: string;
  ratePerDay?: number;
  totalRent?: number;
  advance?: number;
  balance?: number;
  idProofNo?: string;
  dob?: Date;
  anniversary?: Date;
}

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private readonly STORAGE_KEY = 'hms_bookings_list';
  private bookingsSubject = new BehaviorSubject<Booking[]>(this.loadFromStorage());
  bookings$ = this.bookingsSubject.asObservable();

  constructor() {}

  private loadFromStorage(): Booking[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) {
      // Default sample data if nothing in storage
      return [
        {
          id: 1,
          first: 'Pooja',
          last: 'Patel',
          email: 'test@email.com',
          gender: 'Female',
          mobile: '1234567890',
          city: 'Surat',
          arriveDate: new Date('2026-02-18'), // Updated to today for demo
          departDate: new Date('2026-02-25'),
          totalPerson: 2,
          roomType: 'Super Delux',
          address: '123 Main St',
          uploadFile: '',
          note: 'None',
          payment: 'Unpaid',
        },
      ];
    }
    const parsed = JSON.parse(data);
    return parsed.map((b: any) => ({
      ...b,
      arriveDate: new Date(b.arriveDate),
      departDate: new Date(b.departDate)
    }));
  }

  private saveToStorage(bookings: Booking[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(bookings));
    this.bookingsSubject.next(bookings);
  }

  getBookings(): Booking[] {
    return this.bookingsSubject.value;
  }

  addBooking(booking: Booking): void {
    const currentBookings = this.bookingsSubject.value;
    booking.id = currentBookings.length > 0 ? Math.max(...currentBookings.map(b => b.id)) + 1 : 1;
    if (!booking.payment) booking.payment = 'Unpaid';
    const updatedBookings = [...currentBookings, booking];
    this.saveToStorage(updatedBookings);
  }

  getBooking(id: number): Booking | undefined {
    return this.bookingsSubject.value.find((b) => b.id === id);
  }

  updateBooking(updatedBooking: Booking): void {
    const currentBookings = this.bookingsSubject.value;
    const index = currentBookings.findIndex((b) => b.id === updatedBooking.id);
    if (index !== -1) {
      const updatedBookings = [...currentBookings];
      updatedBookings[index] = updatedBooking;
      this.saveToStorage(updatedBookings);
    }
  }

  deleteBooking(id: number): void {
    const updatedBookings = this.bookingsSubject.value.filter((b) => b.id !== id);
    this.saveToStorage(updatedBookings);
  }
}
