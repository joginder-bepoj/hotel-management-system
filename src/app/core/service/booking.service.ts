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
  private bookings: Booking[] = [
    {
      id: 1,
      first: 'Pooja',
      last: 'Patel',
      email: 'test@email.com',
      gender: 'Female',
      mobile: '1234567890',
      city: 'Surat',
      arriveDate: new Date('2018-02-09'),
      departDate: new Date('2018-02-15'),
      totalPerson: 2,
      roomType: 'Super Delux',
      address: '123 Main St',
      uploadFile: '',
      note: 'None',
      payment: 'Unpaid',
    },
  ];
  private bookingsSubject: BehaviorSubject<Booking[]> = new BehaviorSubject<Booking[]>(this.bookings);
  bookings$: Observable<Booking[]> = this.bookingsSubject.asObservable();

  constructor() {}

  getBookings(): Booking[] {
    return this.bookingsSubject.value;
  }

  addBooking(booking: Booking): void {
    const currentBookings = this.bookingsSubject.value;
    booking.id = currentBookings.length > 0 ? Math.max(...currentBookings.map(b => b.id)) + 1 : 1;
    booking.payment = 'Unpaid'; // Default status
    const updatedBookings = [...currentBookings, booking];
    this.bookingsSubject.next(updatedBookings);
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
      this.bookingsSubject.next(updatedBookings);
    }
  }

  deleteBooking(id: number): void {
    const updatedBookings = this.bookingsSubject.value.filter((b) => b.id !== id);
    this.bookingsSubject.next(updatedBookings);
  }
}
