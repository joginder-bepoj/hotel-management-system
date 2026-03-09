import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BookingService, Booking } from '../../../core/service/booking.service';
import Swal from 'sweetalert2';

export interface KeyLog {
    id: number;
    roomNumber: string;
    keyId: string;
    guestName: string;
    issuedAt: Date | string;
    status: 'Active' | 'Returned' | 'Lost';
    keyReceived: boolean;
}

@Component({
    selector: 'app-key-management',
    templateUrl: './key-management.html',
    styleUrls: ['./key-management.scss'],
    standalone: true,
    imports: [
        CommonModule,
        BreadcrumbComponent,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatButtonModule,
        MatIconModule,
        MatChipsModule,
        MatTooltipModule,
        MatSnackBarModule
    ]
})
export class KeyManagementComponent implements OnInit, AfterViewInit {
    displayedColumns: string[] = ['roomNumber', 'keyId', 'guestName', 'issuedAt', 'status', 'keyReceived', 'actions'];
    dataSource: MatTableDataSource<KeyLog> = new MatTableDataSource<KeyLog>([]);
    
    stats = {
        total: 0,
        active: 0,
        returned: 0,
        lost: 0
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
        const storedData = localStorage.getItem('key_logs');
        if (storedData) {
            this.dataSource.data = JSON.parse(storedData);
        } else {
            // Initialize with some data from existing bookings if possible
            const bookings = this.bookingService.getBookings();
            const initialLogs: KeyLog[] = bookings.filter((b: Booking) => b.roomNo).slice(0, 3).map((b: Booking) => ({
                id: Date.now() + Math.random(),
                roomNumber: b.roomNo || '',
                keyId: `K-${b.roomNo}-1`,
                guestName: `${b.first} ${b.last}`,
                issuedAt: new Date().toISOString(),
                status: 'Active',
                keyReceived: true
            }));
            this.dataSource.data = initialLogs;
            this.saveData();
        }
        this.calculateStats();
    }

    saveData() {
        localStorage.setItem('key_logs', JSON.stringify(this.dataSource.data));
    }

    calculateStats() {
        const data = this.dataSource.data;
        this.stats = {
            total: data.length,
            active: data.filter(k => k.status === 'Active').length,
            returned: data.filter(k => k.status === 'Returned').length,
            lost: data.filter(k => k.status === 'Lost').length
        };
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    returnKey(row: KeyLog) {
        row.status = 'Returned';
        row.keyReceived = true;
        this.saveData();
        this.calculateStats();
        Swal.fire({
            title: 'Key Returned',
            text: `Key ${row.keyId} for Room ${row.roomNumber} returned successfully`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        });
    }

    reportLost(row: KeyLog) {
        row.status = 'Lost';
        row.keyReceived = false;
        this.saveData();
        this.calculateStats();
        Swal.fire({
            title: 'Reported Lost',
            text: `Key ${row.keyId} for Room ${row.roomNumber} reported as LOST`,
            icon: 'warning',
            timer: 2000,
            showConfirmButton: false
        });
    }

    async addKeyLog() {
        const bookings = this.bookingService.getBookings().filter((b: Booking) => b.roomNo);
        
        if (bookings.length === 0) {
            Swal.fire('No Active Guests', 'Please assign rooms to guests before issuing keys.', 'info');
            return;
        }

        const optionsHtml = bookings.map((b: Booking) => 
            `<option value="${b.id}">${b.roomNo} - ${b.first} ${b.last}</option>`
        ).join('');

        const { value: selectedBookingId } = await Swal.fire({
            title: 'Issue New Key',
            html: `
                <div style="text-align: left; margin-top: 15px;">
                    <label>Select Guest & Room:</label>
                    <select id="key-guest-select" class="swal2-select" style="width: 100%; margin-bottom: 10px;">
                        ${optionsHtml}
                    </select>
                    <label>Key ID/Tag:</label>
                    <input id="key-tag-input" class="swal2-input" placeholder="e.g. K-101-A">
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Issue Key',
            preConfirm: () => {
                const bookingId = (document.getElementById('key-guest-select') as HTMLSelectElement).value;
                const keyTag = (document.getElementById('key-tag-input') as HTMLInputElement).value;
                if (!bookingId || !keyTag) {
                    Swal.showValidationMessage('Please select a guest and enter a key tag');
                    return false;
                }
                return { bookingId, keyTag };
            }
        });

        if (selectedBookingId) {
            const booking = bookings.find((b: Booking) => b.id === parseInt(selectedBookingId.bookingId));
            if (booking) {
                const newLog: KeyLog = {
                    id: Date.now(),
                    roomNumber: booking.roomNo || '',
                    keyId: selectedBookingId.keyTag,
                    guestName: `${booking.first} ${booking.last}`,
                    issuedAt: new Date().toISOString(),
                    status: 'Active',
                    keyReceived: true
                };
                this.dataSource.data = [newLog, ...this.dataSource.data];
                this.saveData();
                this.calculateStats();
                Swal.fire('Issued!', `Key issued for Room ${newLog.roomNumber}`, 'success');
            }
        }
    }
}
