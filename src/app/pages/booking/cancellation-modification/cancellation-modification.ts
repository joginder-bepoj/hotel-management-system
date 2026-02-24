import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { BookingService } from '../../../core/service/booking.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-cancellation-modification',
    templateUrl: './cancellation-modification.html',
    styleUrls: ['./cancellation-modification.scss'],
    standalone: true,
    imports: [
        CommonModule,
        BreadcrumbComponent,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        MatCardModule,
        MatDialogModule,
        FormsModule
    ]
})
export class CancellationModificationComponent implements OnInit {
    searchQuery: string = '';
    allBookings: any[] = [];
    filteredBookings: any[] = [];

    constructor(
        private bookingService: BookingService,
        private snackBar: MatSnackBar,
        private router: Router,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.loadBookings();
    }

    loadBookings(): void {
        this.allBookings = this.bookingService.getBookings();
        this.filteredBookings = [...this.allBookings];
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

    modifyBooking(bookingId: number): void {
        this.router.navigate(['/booking/edit-booking', bookingId]);
    }

    cancelBooking(booking: any): void {
        Swal.fire({
            title: 'Cancel Booking?',
            text: `Are you sure you want to cancel the booking for ${booking.first} ${booking.last}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, cancel it!'
        }).then((result) => {
            if (result.isConfirmed) {
                this.bookingService.deleteBooking(booking.id);
                this.loadBookings();
                Swal.fire(
                    'Cancelled!',
                    `Booking for ${booking.first} ${booking.last} has been cancelled.`,
                    'success'
                );
            }
        });
    }
}
