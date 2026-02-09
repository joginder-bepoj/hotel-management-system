import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

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
export class RoomAllocationComponent {
    floors = [1, 2, 3, 4];
    rooms: Room[] = [];

    constructor() {
        this.generateMockRooms();
    }

    generateMockRooms() {
        const statuses: Room['status'][] = ['Available', 'Occupied', 'Reserved', 'Maintenance', 'Dirty'];
        const types = ['Single', 'Double', 'Suite', 'Deluxe'];

        for (let floor of this.floors) {
            for (let i = 1; i <= 6; i++) {
                const status = statuses[Math.floor(Math.random() * statuses.length)];
                this.rooms.push({
                    number: `${floor}0${i}`,
                    type: types[Math.floor(Math.random() * types.length)],
                    status: status,
                    guestName: status === 'Occupied' ? 'John Doe' : undefined,
                    floor: floor
                });
            }
        }
    }

    getRoomsByFloor(floor: number): Room[] {
        return this.rooms.filter(r => r.floor === floor);
    }

    getStatusColor(status: string): string {
        switch (status) {
            case 'Available': return 'search-bg-green'; // Custom Simple CSS class
            case 'Occupied': return 'search-bg-red';
            case 'Reserved': return 'search-bg-blue';
            case 'Maintenance': return 'search-bg-orange';
            case 'Dirty': return 'search-bg-grey';
            default: return '';
        }
    }
}
