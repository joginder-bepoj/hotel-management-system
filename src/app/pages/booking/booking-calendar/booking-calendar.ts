import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BookingService, Booking } from '../../../core/service/booking.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-booking-calendar',
    templateUrl: './booking-calendar.html',
    styleUrls: ['./booking-calendar.scss'],
    standalone: true,
    imports: [
        CommonModule,
        BreadcrumbComponent,
        MatButtonModule,
        MatIconModule
    ]
})
export class BookingCalendarComponent implements OnInit {
    displayMonth: Date = new Date();
    daysInMonth: Date[] = [];
    weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    bookings: any[] = [];
    private bookingSubscription: Subscription | undefined;

    constructor(private bookingService: BookingService) { }

    ngOnInit(): void {
        this.generateCalendar();
        this.bookingSubscription = this.bookingService.bookings$.subscribe(bookings => {
            this.mapBookings(bookings);
        });
    }

    ngOnDestroy(): void {
        if (this.bookingSubscription) {
            this.bookingSubscription.unsubscribe();
        }
    }

    mapBookings(bookings: Booking[]): void {
        const classes = ['bg-info', 'bg-success', 'bg-warning', 'bg-danger'];
        this.bookings = bookings.map((b, index) => ({
            date: new Date(b.arriveDate),
            title: `${b.first} ${b.last} - ${b.roomType}`,
            class: classes[index % classes.length]
        }));
    }

    generateCalendar(): void {
        const year = this.displayMonth.getFullYear();
        const month = this.displayMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        const days: Date[] = [];
        
        // Add padding days from previous month
        const startPadding = firstDay.getDay();
        for (let i = startPadding; i > 0; i--) {
            days.push(new Date(year, month, 1 - i));
        }
        
        // Add days of current month
        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push(new Date(year, month, i));
        }
        
        // Add padding days for next month to complete the grid (6 weeks)
        const endPadding = 42 - days.length;
        for (let i = 1; i <= endPadding; i++) {
            days.push(new Date(year, month + 1, i));
        }
        
        this.daysInMonth = days;
    }

    prevMonth(): void {
        this.displayMonth = new Date(this.displayMonth.getFullYear(), this.displayMonth.getMonth() - 1, 1);
        this.generateCalendar();
    }

    nextMonth(): void {
        this.displayMonth = new Date(this.displayMonth.getFullYear(), this.displayMonth.getMonth() + 1, 1);
        this.generateCalendar();
    }

    getBookingsForDate(date: Date): any[] {
        return this.bookings.filter(b => 
            b.date.getDate() === date.getDate() && 
            b.date.getMonth() === date.getMonth() && 
            b.date.getFullYear() === date.getFullYear()
        );
    }

    isCurrentMonth(date: Date): boolean {
        return date.getMonth() === this.displayMonth.getMonth();
    }

    isToday(date: Date): boolean {
        const today = new Date();
        return date.getDate() === today.getDate() && 
            date.getMonth() === today.getMonth() && 
            date.getFullYear() === today.getFullYear();
    }
}
