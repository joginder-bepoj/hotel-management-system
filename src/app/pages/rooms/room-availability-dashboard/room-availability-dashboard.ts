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

    upcomingBookings = [
        { date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), checkIns: 5, checkOuts: 3 },
        { date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), checkIns: 3, checkOuts: 4 },
        { date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), checkIns: 7, checkOuts: 2 },
        { date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), checkIns: 4, checkOuts: 5 },
        { date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), checkIns: 2, checkOuts: 3 },
    ];

    constructor(
        private roomService: RoomService,
        private hotelService: HotelService
    ) { }

    ngOnInit(): void {
        this.loadHotelData();
    }

    loadHotelData(): void {
        this.activeHotel = this.hotelService.getActiveHotel();

        if (this.activeHotel) {
            const floors = Number(this.activeHotel.total_floor || 1);
            const roomsPerFloor = Number(this.activeHotel.total_rooms || 0);
            this.availabilityStats.totalRooms = floors * roomsPerFloor;
            
            console.log(this.availabilityStats, "availabilityStats")
            // Generate room type breakdown based on setup
            if (this.activeHotel.room_types && this.activeHotel.room_types.length > 0) {
                const types = this.activeHotel.room_types;
                const totalRooms = this.availabilityStats.totalRooms;
                const roomsPerType = Math.floor(totalRooms / types.length);
                const remainder = totalRooms % types.length;

                this.roomTypeAvailability = types.map((type: string, index: number) => {
                    const count = roomsPerType + (index === 0 ? remainder : 0);
                    // Mock distribution: ~60% available, ~30% occupied, ~10% reserved
                    const available = Math.floor(count * 0.6);
                    const occupied = Math.floor(count * 0.3);
                    const reserved = count - available - occupied;

                    return {
                        type: type,
                        total: count,
                        available: available,
                        occupied: occupied,
                        reserved: reserved
                    };
                });
            } else {
                // Default fallback if no room types defined
                this.roomTypeAvailability = [
                    { type: 'General', total: this.availabilityStats.totalRooms, available: Math.floor(this.availabilityStats.totalRooms * 0.6), occupied: Math.floor(this.availabilityStats.totalRooms * 0.3), reserved: Math.floor(this.availabilityStats.totalRooms * 0.1) }
                ];
            }
        }
        this.calculateStats();
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
