import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

export interface GuestHistory {
    id: number;
    name: string;
    contact: string;
    email: string;
    totalStays: number;
    lastVisit: Date | string;
    totalSpent: number;
    rating: number;
}

import { BookingService, Booking } from '../../../core/service/booking.service';

@Component({
    selector: 'app-guest-history',
    templateUrl: './guest-history.html',
    styleUrls: ['./guest-history.scss'],
    standalone: true,
    imports: [
        CommonModule,
        BreadcrumbComponent,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatTooltipModule,
        MatSnackBarModule
    ]
})
export class GuestHistoryComponent implements OnInit, AfterViewInit {
    displayedColumns: string[] = ['name', 'contact', 'email', 'totalStays', 'lastVisit', 'totalSpent', 'rating', 'actions'];
    dataSource: MatTableDataSource<GuestHistory> = new MatTableDataSource<GuestHistory>([]);

    stats = {
        totalGuests: 0,
        repeatGuests: 0,
        topRated: 0,
        totalRevenue: 0
    };

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private snackBar: MatSnackBar,
        private bookingService: BookingService
    ) {}

    ngOnInit() {
        this.loadData();
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    loadData() {
        const allBookings = this.bookingService.getBookings();
        
        // Group by email to identify unique guests
        const guestsMap = new Map<string, GuestHistory>();
        
        allBookings.forEach(b => {
            const email = b.email || b.mobile; // Use mobile if email is missing
            if (!guestsMap.has(email)) {
                guestsMap.set(email, {
                    id: b.id,
                    name: `${b.first} ${b.last}`,
                    contact: b.mobile,
                    email: b.email,
                    totalStays: 0,
                    lastVisit: b.arriveDate,
                    totalSpent: 0,
                    rating: 5 // Default rating
                });
            }
            
            const guest = guestsMap.get(email)!;
            guest.totalStays += 1;
            guest.totalSpent += (b.totalRent || 0);
            
            // Check if this visit is later than stored lastVisit
            if (new Date(b.arriveDate) > new Date(guest.lastVisit)) {
                guest.lastVisit = b.arriveDate;
            }
        });

        const guestList = Array.from(guestsMap.values());
        this.dataSource.data = guestList;
        this.calculateStats();
    }

    calculateStats() {
        const data = this.dataSource.data;
        this.stats = {
            totalGuests: data.length,
            repeatGuests: data.filter(g => g.totalStays > 1).length,
            topRated: data.filter(g => g.rating === 5).length,
            totalRevenue: data.reduce((acc, curr) => acc + curr.totalSpent, 0)
        };
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    getStars(rating: number): number[] {
        return Array(rating).fill(0);
    }

    exportData() {
        Swal.fire({
            title: 'Exported!',
            text: 'Guest history data exported successfully',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        });
    }

    viewDetails(guest: GuestHistory) {
        Swal.fire({
            title: 'Guest Details',
            text: `Viewing details for ${guest.name}. Total Spent: ${guest.totalSpent}`,
            icon: 'info'
        });
    }
}

