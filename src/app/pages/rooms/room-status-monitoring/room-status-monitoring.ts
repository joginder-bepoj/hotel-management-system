import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RoomService } from '../../../core/service/room.service';

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
    
    rooms: RoomStatus[] = [
        { roomNo: '101', floor: 1, roomType: 'Single', status: 'occupied', guestName: 'John Doe', checkIn: new Date('2026-02-08'), checkOut: new Date('2026-02-12'), lastCleaned: new Date('2026-02-08') },
        { roomNo: '102', floor: 1, roomType: 'Double', status: 'available', lastCleaned: new Date('2026-02-09') },
        { roomNo: '103', floor: 1, roomType: 'Suite', status: 'cleaning', lastCleaned: new Date('2026-02-09') },
        { roomNo: '104', floor: 1, roomType: 'Single', status: 'maintenance' },
        { roomNo: '105', floor: 1, roomType: 'Double', status: 'reserved', guestName: 'Jane Smith', checkIn: new Date('2026-02-10'), checkOut: new Date('2026-02-15') },
        { roomNo: '201', floor: 2, roomType: 'Single', status: 'available', lastCleaned: new Date('2026-02-09') },
        { roomNo: '202', floor: 2, roomType: 'Double', status: 'occupied', guestName: 'Bob Wilson', checkIn: new Date('2026-02-07'), checkOut: new Date('2026-02-11'), lastCleaned: new Date('2026-02-07') },
        { roomNo: '203', floor: 2, roomType: 'Suite', status: 'available', lastCleaned: new Date('2026-02-09') },
        { roomNo: '204', floor: 2, roomType: 'Deluxe', status: 'cleaning', lastCleaned: new Date('2026-02-09') },
        { roomNo: '205', floor: 2, roomType: 'Double', status: 'occupied', guestName: 'Alice Brown', checkIn: new Date('2026-02-08'), checkOut: new Date('2026-02-13'), lastCleaned: new Date('2026-02-08') },
    ];

    filteredRooms: RoomStatus[] = [];

    constructor(
        private roomService: RoomService,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
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
        this.snackBar.open(`Room ${room.roomNo} status updated to ${newStatus}`, 'Close', {
            duration: 3000,
            verticalPosition: 'bottom',
            horizontalPosition: 'center'
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
