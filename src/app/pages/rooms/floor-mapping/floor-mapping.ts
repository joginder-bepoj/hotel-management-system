import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RoomService } from '../../../core/service/room.service';

interface RoomPosition {
    roomNo: string;
    status: 'available' | 'occupied' | 'maintenance' | 'reserved';
    roomType: string;
    floor: number;
    position: { row: number; col: number };
}

@Component({
    selector: 'app-floor-mapping',
    templateUrl: './floor-mapping.html',
    styleUrls: ['./floor-mapping.scss'],
    standalone: true,
    imports: [
        CommonModule,
        BreadcrumbComponent,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatSelectModule,
        MatFormFieldModule
    ]
})
export class FloorMappingComponent implements OnInit {
    selectedFloor: number = 1;
    floors: number[] = [1, 2, 3, 4, 5];
    
    // Mock room layout data
    roomsLayout: RoomPosition[] = [
        // Floor 1
        { roomNo: '101', status: 'occupied', roomType: 'Single', floor: 1, position: { row: 0, col: 0 } },
        { roomNo: '102', status: 'available', roomType: 'Double', floor: 1, position: { row: 0, col: 1 } },
        { roomNo: '103', status: 'reserved', roomType: 'Suite', floor: 1, position: { row: 0, col: 2 } },
        { roomNo: '104', status: 'available', roomType: 'Single', floor: 1, position: { row: 0, col: 3 } },
        { roomNo: '105', status: 'maintenance', roomType: 'Double', floor: 1, position: { row: 1, col: 0 } },
        { roomNo: '106', status: 'occupied', roomType: 'Deluxe', floor: 1, position: { row: 1, col: 1 } },
        { roomNo: '107', status: 'available', roomType: 'Single', floor: 1, position: { row: 1, col: 2 } },
        { roomNo: '108', status: 'available', roomType: 'Double', floor: 1, position: { row: 1, col: 3 } },
        
        // Floor 2
        { roomNo: '201', status: 'available', roomType: 'Single', floor: 2, position: { row: 0, col: 0 } },
        { roomNo: '202', status: 'occupied', roomType: 'Double', floor: 2, position: { row: 0, col: 1 } },
        { roomNo: '203', status: 'available', roomType: 'Suite', floor: 2, position: { row: 0, col: 2 } },
        { roomNo: '204', status: 'reserved', roomType: 'Single', floor: 2, position: { row: 0, col: 3 } },
        { roomNo: '205', status: 'available', roomType: 'Double', floor: 2, position: { row: 1, col: 0 } },
        { roomNo: '206', status: 'occupied', roomType: 'Deluxe', floor: 2, position: { row: 1, col: 1 } },
        { roomNo: '207', status: 'maintenance', roomType: 'Single', floor: 2, position: { row: 1, col: 2 } },
        { roomNo: '208', status: 'available', roomType: 'Double', floor: 2, position: { row: 1, col: 3 } },
    ];

    constructor(private roomService: RoomService) { }

    ngOnInit(): void {
        // Initialize with floor 1
    }

    getFloorRooms(): RoomPosition[] {
        return this.roomsLayout.filter(room => room.floor === this.selectedFloor);
    }

    getStatusIcon(status: string): string {
        switch (status) {
            case 'available': return 'check_circle';
            case 'occupied': return 'person';
            case 'maintenance': return 'build';
            case 'reserved': return 'event';
            default: return 'help';
        }
    }

    getStatusLabel(status: string): string {
        return status.charAt(0).toUpperCase() + status.slice(1);
    }

    getRoomStats() {
        const floorRooms = this.getFloorRooms();
        return {
            total: floorRooms.length,
            available: floorRooms.filter(r => r.status === 'available').length,
            occupied: floorRooms.filter(r => r.status === 'occupied').length,
            maintenance: floorRooms.filter(r => r.status === 'maintenance').length,
            reserved: floorRooms.filter(r => r.status === 'reserved').length
        };
    }
}
