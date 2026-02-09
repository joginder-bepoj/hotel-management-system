import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { BookingService } from '../../../core/service/booking.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-check-in-out',
    templateUrl: './check-in-out.html',
    styleUrls: ['./check-in-out.scss'],
    standalone: true,
    imports: [
        CommonModule,
        BreadcrumbComponent,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        MatTabsModule,
        MatCardModule,
        FormsModule
    ]
})
export class CheckInOutComponent implements OnInit {
    searchQuery: string = '';
    allBookings: any[] = [];
    filteredBookings: any[] = [];
    todayCheckIns: any[] = [];
    todayCheckOuts: any[] = [];

    constructor(
        private bookingService: BookingService,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.loadBookings();
    }

    loadBookings(): void {
        this.allBookings = this.bookingService.getBookings();
        this.filterTodayBookings();
        this.filteredBookings = [...this.allBookings];
    }

    filterTodayBookings(): void {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        this.todayCheckIns = this.allBookings.filter(booking => {
            const arriveDate = new Date(booking.arriveDate);
            arriveDate.setHours(0, 0, 0, 0);
            return arriveDate.getTime() === today.getTime() && booking.status !== 'Checked-In';
        });

        this.todayCheckOuts = this.allBookings.filter(booking => {
            const departDate = new Date(booking.departDate);
            departDate.setHours(0, 0, 0, 0);
            return departDate.getTime() === today.getTime() && booking.status === 'Checked-In';
        });
    }

    searchBooking(): void {
        if (!this.searchQuery.trim()) {
            this.filteredBookings = [...this.allBookings];
            return;
        }

        const query = this.searchQuery.toLowerCase();
        this.filteredBookings = this.allBookings.filter(booking =>
            booking.first.toLowerCase().includes(query) ||
            booking.last.toLowerCase().includes(query) ||
            booking.email.toLowerCase().includes(query) ||
            booking.mobile.toString().includes(query) ||
            booking.roomNo?.toLowerCase().includes(query)
        );
    }

    checkIn(booking: any): void {
        booking.status = 'Checked-In';
        this.bookingService.updateBooking(booking);
        this.snackBar.open(`${booking.first} ${booking.last} checked in successfully!`, 'Close', {
            duration: 3000,
            verticalPosition: 'bottom',
            horizontalPosition: 'center'
        });
        this.filterTodayBookings();
    }

    checkOut(booking: any): void {
        booking.status = 'Checked-Out';
        this.bookingService.updateBooking(booking);
        this.snackBar.open(`${booking.first} ${booking.last} checked out successfully!`, 'Close', {
            duration: 3000,
            verticalPosition: 'bottom',
            horizontalPosition: 'center'
        });
        this.filterTodayBookings();
    }
}
