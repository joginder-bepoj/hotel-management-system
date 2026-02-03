import { Injectable } from '@angular/core';

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

  constructor() {}

  getBookings(): Booking[] {
    return this.bookings;
  }

  addBooking(booking: Booking): void {
    booking.id = this.bookings.length > 0 ? Math.max(...this.bookings.map(b => b.id)) + 1 : 1;
    booking.payment = 'Unpaid'; // Default status
    this.bookings.push(booking);
  }

  getBooking(id: number): Booking | undefined {
    return this.bookings.find((b) => b.id === id);
  }

  updateBooking(updatedBooking: Booking): void {
    const index = this.bookings.findIndex((b) => b.id === updatedBooking.id);
    if (index !== -1) {
      this.bookings[index] = updatedBooking;
    }
  }

  deleteBooking(id: number): void {
    this.bookings = this.bookings.filter((b) => b.id !== id);
  }
}
