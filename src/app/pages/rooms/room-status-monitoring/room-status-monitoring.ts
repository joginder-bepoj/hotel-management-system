import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { RoomService, Room } from '../../../core/service/room.service';
import { BookingService, Booking } from '../../../core/service/booking.service';

interface RoomStatus {
    roomNo: string;
    floor: number;
    roomType: string;
    status: 'available' | 'occupied' | 'cleaning' | 'maintenance' | 'reserved';
    guestName?: string;
    checkIn?: Date;
    checkOut?: Date;
    lastCleaned?: Date;
}

@Component({
    selector: 'app-room-status-monitoring',
    templateUrl: './room-status-monitoring.html',
    styleUrls: ['./room-status-monitoring.scss'],
    standalone: true,
    imports: [
        CommonModule,
        BreadcrumbComponent,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatChipsModule,
        MatMenuModule
    ]
})
export class RoomStatusMonitoringComponent implements OnInit {
    selectedFilter: string = 'all';
    
    rooms: RoomStatus[] = [];
    filteredRooms: RoomStatus[] = [];

    constructor(
        private roomService: RoomService,
        private bookingService: BookingService,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.loadDynamicStatus();
    }

    loadDynamicStatus(): void {
        const allRooms = this.roomService.getRooms();
        const allBookings = this.bookingService.getBookings();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        this.rooms = allRooms.map(room => {
            // Find if there's an active booking for this room TODAY
            const activeBooking = allBookings.find(b => {
                if (b.roomNo !== room.roomNo) return false;
                
                const checkIn = new Date(b.arriveDate);
                const checkOut = new Date(b.departDate);
                checkIn.setHours(0, 0, 0, 0);
                checkOut.setHours(0, 0, 0, 0);

                return today >= checkIn && today < checkOut;
            });

            // Map standard Room to RoomStatus
            const status: RoomStatus = {
                roomNo: room.roomNo,
                floor: parseInt(room.roomNo[0]) || 1, // Simple floor inference from room number
                roomType: room.roomType,
                status: activeBooking ? 'occupied' : 'available',
                guestName: activeBooking ? `${activeBooking.first} ${activeBooking.last}` : undefined,
                checkIn: activeBooking ? new Date(activeBooking.arriveDate) : undefined,
                checkOut: activeBooking ? new Date(activeBooking.departDate) : undefined,
                lastCleaned: new Date() // Dynamic fallback
            };

            return status;
        });

        this.applyFilter('all');
    }

    applyFilter(filter: string): void {
        this.selectedFilter = filter;
        if (filter === 'all') {
            this.filteredRooms = [...this.rooms];
        } else {
            this.filteredRooms = this.rooms.filter(room => room.status === filter);
        }
    }

    getStatusCount(status: string): number {
        if (status === 'all') return this.rooms.length;
        return this.rooms.filter(room => room.status === status).length;
    }

    updateRoomStatus(room: RoomStatus, newStatus: RoomStatus['status']): void {
        room.status = newStatus;
        if (newStatus === 'cleaning' || newStatus === 'available') {
            room.lastCleaned = new Date();
        }
        Swal.fire({
            title: 'Updated!',
            text: `Room ${room.roomNo} status updated to ${newStatus}`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        });
        this.applyFilter(this.selectedFilter);
    }

    getStatusIcon(status: string): string {
        switch (status) {
            case 'available': return 'check_circle';
            case 'occupied': return 'person';
            case 'cleaning': return 'cleaning_services';
            case 'maintenance': return 'build';
            case 'reserved': return 'event';
            default: return 'help';
        }
    }
}
