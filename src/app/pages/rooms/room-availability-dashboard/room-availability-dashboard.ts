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

    // Mock availability data
    availabilityStats = {
        totalRooms: 50,
        availableRooms: 28,
        occupiedRooms: 18,
        reservedRooms: 4,
        maintenanceRooms: 0,
        occupancyRate: 36
    };

    roomTypeAvailability = [
        { type: 'Single', total: 15, available: 8, occupied: 6, reserved: 1 },
        { type: 'Double', total: 20, available: 12, occupied: 7, reserved: 1 },
        { type: 'Suite', total: 10, available: 5, occupied: 3, reserved: 2 },
        { type: 'Deluxe', total: 5, available: 3, occupied: 2, reserved: 0 }
    ];

    upcomingBookings = [
        { date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), checkIns: 5, checkOuts: 3 },
        { date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), checkIns: 3, checkOuts: 4 },
        { date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), checkIns: 7, checkOuts: 2 },
        { date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), checkIns: 4, checkOuts: 5 },
        { date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), checkIns: 2, checkOuts: 3 },
    ];

    constructor(private roomService: RoomService) { }

    ngOnInit(): void {
        this.calculateStats();
    }

    calculateStats(): void {
        // In a real app, this would fetch data from the service based on date range
        this.availabilityStats.occupancyRate = Math.round(
            (this.availabilityStats.occupiedRooms / this.availabilityStats.totalRooms) * 100
        );
    }

    getAvailabilityPercentage(type: any): number {
        return Math.round((type.available / type.total) * 100);
    }

    refreshData(): void {
        this.calculateStats();
    }
}
