import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { RoomService } from '../../../core/service/room.service';
import { HotelService } from '../../../core/services/hotel.service';
import { BookingService, Booking } from '../../../core/service/booking.service';

@Component({
    selector: 'app-room-availability-dashboard',
    templateUrl: './room-availability-dashboard.html',
    styleUrls: ['./room-availability-dashboard.scss'],
    standalone: true,
    imports: [
        CommonModule,
        BreadcrumbComponent,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        MatNativeDateModule,
        FormsModule
    ]
})
export class RoomAvailabilityDashboardComponent implements OnInit {
    startDate: Date = new Date();
    endDate: Date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    activeHotel: any;

    // Statistics object
    availabilityStats = {
        totalRooms: 0,
        availableRooms: 0,
        occupiedRooms: 0,
        reservedRooms: 0,
        maintenanceRooms: 0,
        occupancyRate: 0
    };

    roomTypeAvailability: any[] = [];

    upcomingBookings: any[] = [];

    constructor(
        private roomService: RoomService,
        private hotelService: HotelService,
        private bookingService: BookingService
    ) { }

    ngOnInit(): void {
        this.loadHotelData();
    }

    loadHotelData(): void {
        this.activeHotel = this.hotelService.getActiveHotel();
        const allRooms = this.roomService.getRooms();
        const allBookings = this.bookingService.getBookings();

        // 1. Determine Total Rooms (prefer hotel setup's total, fallback to actual added rooms count)
        const setupTotal = this.activeHotel ? Number(this.activeHotel.total_rooms || 0) : 0;
        this.availabilityStats.totalRooms = Math.max(setupTotal, allRooms.length);

        // Group actual created rooms by roomType
        const physicallyAddedRoomsByType = new Map<string, any[]>();
        allRooms.forEach(room => {
            const type = room.roomType || 'General';
            if (!physicallyAddedRoomsByType.has(type)) {
                physicallyAddedRoomsByType.set(type, []);
            }
            physicallyAddedRoomsByType.get(type)!.push(room);
        });

        // 2. Identify Occupied Rooms/Bookings for the current date
        const isOccupied = (b: any) => {
            const checkIn = new Date(b.arriveDate);
            const checkOut = new Date(b.departDate);
            return this.startDate >= checkIn && this.startDate < checkOut;
        };

        const setupRoomTypes = (this.activeHotel && this.activeHotel.room_types) ? this.activeHotel.room_types : [];

        // 3. Generate dynamic Room Type breakdown
        if (setupRoomTypes.length > 0) {
            // Hotel has a defined setup with room types
            this.roomTypeAvailability = setupRoomTypes.map((rt: any) => {
                const typeName = rt.name || rt;
                const physicalOfType = physicallyAddedRoomsByType.get(typeName) || [];
                const capacity = Math.max(rt.totalRooms || 0, physicalOfType.length);
                
                const occupiedCount = allBookings.filter(b => {
                    const occupiedAtStart = isOccupied(b);
                    if (b.roomNo) {
                        const roomMatches = physicalOfType.find(r => r.roomNo === b.roomNo);
                        return occupiedAtStart && !!roomMatches;
                    }
                    return occupiedAtStart && b.roomType === typeName;
                }).length;

                return {
                    type: typeName,
                    total: capacity,
                    available: Math.max(0, capacity - occupiedCount),
                    occupied: occupiedCount,
                    reserved: 0
                };
            });
        } else {
            // No setup defined, build strictly from physically added rooms
            this.roomTypeAvailability = Array.from(physicallyAddedRoomsByType.keys()).map(typeName => {
                const roomsOfType = physicallyAddedRoomsByType.get(typeName)!;
                const capacity = roomsOfType.length;
                
                const occupiedCount = allBookings.filter(b => {
                    const occupiedAtStart = isOccupied(b);
                    if (b.roomNo) {
                        const roomMatches = roomsOfType.find(r => r.roomNo === b.roomNo);
                        return occupiedAtStart && !!roomMatches;
                    }
                    return occupiedAtStart && b.roomType === typeName;
                }).length;

                return {
                    type: typeName,
                    total: capacity,
                    available: Math.max(0, capacity - occupiedCount),
                    occupied: occupiedCount,
                    reserved: 0
                };
            });
        }

        this.calculateUpcomingBookings(allBookings);
        this.calculateStats();
    }

    calculateUpcomingBookings(bookings: Booking[]): void {
        if (!bookings || bookings.length === 0) {
            this.upcomingBookings = [];
            return;
        }

        const stats = [];
        for (let i = 1; i <= 5; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            date.setHours(0, 0, 0, 0);

            const checkIns = bookings.filter(b => {
                const d = new Date(b.arriveDate);
                d.setHours(0, 0, 0, 0);
                return d.getTime() === date.getTime();
            }).length;

            const checkOuts = bookings.filter(b => {
                const d = new Date(b.departDate);
                d.setHours(0, 0, 0, 0);
                return d.getTime() === date.getTime();
            }).length;

            stats.push({ date, checkIns, checkOuts });
        }
        this.upcomingBookings = stats;
    }

    calculateStats(): void {
        if (this.roomTypeAvailability.length > 0) {
            this.availabilityStats.availableRooms = this.roomTypeAvailability.reduce((sum, item) => sum + item.available, 0);
            this.availabilityStats.occupiedRooms = this.roomTypeAvailability.reduce((sum, item) => sum + item.occupied, 0);
            this.availabilityStats.reservedRooms = this.roomTypeAvailability.reduce((sum, item) => sum + item.reserved, 0);
            
            if (this.availabilityStats.totalRooms > 0) {
                this.availabilityStats.occupancyRate = Math.round(
                    (this.availabilityStats.occupiedRooms / this.availabilityStats.totalRooms) * 100
                );
            }
        }
    }

    getAvailabilityPercentage(type: any): number {
        if (!type.total) return 0;
        return Math.round((type.available / type.total) * 100);
    }

    refreshData(): void {
        this.loadHotelData();
    }
}
