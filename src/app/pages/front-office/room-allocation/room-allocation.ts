import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RoomService } from '../../../core/service/room.service';
import { BookingService, Booking } from '../../../core/service/booking.service';
import Swal from 'sweetalert2';

interface Room {
    number: string;
    type: string;
    status: 'Available' | 'Occupied' | 'Reserved' | 'Maintenance' | 'Dirty';
    guestName?: string;
    floor: number;
}

@Component({
    selector: 'app-room-allocation',
    templateUrl: './room-allocation.html',
    styleUrls: ['./room-allocation.scss'],
    standalone: true,
    imports: [
        CommonModule,
        BreadcrumbComponent,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule
    ]
})
export class RoomAllocationComponent implements OnInit {
    floors: number[] = [];
    rooms: Room[] = [];
    unassignedBookings: any[] = [];

    constructor(
        private roomService: RoomService,
        private bookingService: BookingService
    ) {}

    ngOnInit() {
        this.loadDynamicData();
    }

    loadDynamicData() {
        const allRooms = this.roomService.getRooms();
        const allBookings = this.bookingService.getBookings();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Find unassigned bookings
        this.unassignedBookings = allBookings.filter((b: Booking) => !b.roomNo);

        // Map real rooms with live status
        this.rooms = allRooms.map((r: any) => {
            const activeBooking = allBookings.find((b: Booking) => {
                if (b.roomNo !== r.roomNo) return false;
                const checkIn = new Date(b.arriveDate);
                const checkOut = new Date(b.departDate);
                checkIn.setHours(0, 0, 0, 0);
                checkOut.setHours(0, 0, 0, 0);
                return today >= checkIn && today < checkOut;
            });

            const numericFloor = parseInt(r.roomNo[0]) || 1; 

            return {
                number: r.roomNo,
                type: r.roomType,
                status: activeBooking ? 'Occupied' : 'Available',
                guestName: activeBooking ? `${activeBooking.first} ${activeBooking.last}` : undefined,
                floor: numericFloor
            };
        });

        // Derive unique floors
        this.floors = Array.from(new Set(this.rooms.map(r => r.floor))).sort((a,b) => a - b);
    }

    getRoomsByFloor(floor: number): Room[] {
        return this.rooms.filter(r => r.floor === floor);
    }

    getStatusColor(status: string): string {
        switch (status) {
            case 'Available': return 'search-bg-green';
            case 'Occupied': return 'search-bg-red';
            case 'Reserved': return 'search-bg-blue';
            case 'Maintenance': return 'search-bg-orange';
            case 'Dirty': return 'search-bg-grey';
            default: return '';
        }
    }

    async assignRoom(room: Room) {
        if (room.status === 'Occupied') {
            Swal.fire('Unavailable', 'This room is currently occupied.', 'error');
            return;
        }

        if (this.unassignedBookings.length === 0) {
            Swal.fire({
                title: 'No Pending Bookings',
                text: 'There are currently no bookings awaiting a room assignment.',
                icon: 'info'
            });
            return;
        }

        const optionsHtml = this.unassignedBookings.map((b: Booking) => 
            `<option value="${b.id}">${b.first} ${b.last} (${b.roomType})</option>`
        ).join('');

        const { value: selectedBookingId } = await Swal.fire({
            title: `Assign Room ${room.number}`,
            html: `
                <select id="booking-select" class="swal2-select" style="width: 100%; padding: 10px; margin-top: 15px;">
                    <option value="" disabled selected>Select a pending booking</option>
                    ${optionsHtml}
                </select>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Assign',
            preConfirm: () => {
                const selectElement = document.getElementById('booking-select') as HTMLSelectElement;
                if (!selectElement.value) {
                    Swal.showValidationMessage('Please select a booking to assign');
                    return false;
                }
                return selectElement.value;
            }
        });

        if (selectedBookingId) {
            const numId = parseInt(selectedBookingId);
            const booking = this.unassignedBookings.find((b: Booking) => b.id === numId);
            if (booking) {
                booking.roomNo = room.number;
                this.bookingService.updateBooking(booking);
                
                Swal.fire({
                    title: 'Assigned!',
                    text: `Room ${room.number} assigned to ${booking.first} ${booking.last}.`,
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });

                // Refresh state
                this.loadDynamicData();
            }
        }
    }
}
