import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

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
    
    // Mock booking data
    bookings = [
        { date: new Date(new Date().getFullYear(), new Date().getMonth(), 10), title: 'John Doe - Deluxe', class: 'bg-info' },
        { date: new Date(new Date().getFullYear(), new Date().getMonth(), 15), title: 'Jane Smith - Suite', class: 'bg-success' },
        { date: new Date(new Date().getFullYear(), new Date().getMonth(), 20), title: 'Group Booking - 5 Rooms', class: 'bg-warning' },
        { date: new Date(new Date().getFullYear(), new Date().getMonth(), 25), title: 'Alice Brown - Single', class: 'bg-danger' },
    ];

    constructor() { }

    ngOnInit(): void {
        this.generateCalendar();
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
