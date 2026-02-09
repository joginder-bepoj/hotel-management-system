import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';

interface RoomTypePrice {
    id: number;
    type: string;
    basePrice: number;
    weekendPrice: number;
    peakSeasonPrice: number;
    amenities: string[];
    maxOccupancy: number;
    description: string;
}

@Component({
    selector: 'app-room-types-pricing',
    templateUrl: './room-types-pricing.html',
    styleUrls: ['./room-types-pricing.scss'],
    standalone: true,
    imports: [
        CommonModule,
        BreadcrumbComponent,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        FormsModule
    ]
})
export class RoomTypesPricingComponent implements OnInit {
    roomTypes: RoomTypePrice[] = [
        {
            id: 1,
            type: 'Single',
            basePrice: 1500,
            weekendPrice: 1800,
            peakSeasonPrice: 2200,
            amenities: ['WiFi', 'TV', 'AC'],
            maxOccupancy: 1,
            description: 'Comfortable single room with basic amenities'
        },
        {
            id: 2,
            type: 'Double',
            basePrice: 2500,
            weekendPrice: 3000,
            peakSeasonPrice: 3500,
            amenities: ['WiFi', 'TV', 'AC', 'Mini Bar'],
            maxOccupancy: 2,
            description: 'Spacious double room perfect for couples'
        },
        {
            id: 3,
            type: 'Suite',
            basePrice: 5000,
            weekendPrice: 6000,
            peakSeasonPrice: 7500,
            amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Jacuzzi', 'Living Room'],
            maxOccupancy: 4,
            description: 'Luxurious suite with separate living area'
        },
        {
            id: 4,
            type: 'Deluxe',
            basePrice: 3500,
            weekendPrice: 4200,
            peakSeasonPrice: 5000,
            amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Balcony'],
            maxOccupancy: 3,
            description: 'Premium room with stunning views'
        }
    ];

    editingRoom: RoomTypePrice | null = null;

    constructor(
        private dialog: MatDialog,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        // Initialize
    }

    editRoomType(room: RoomTypePrice): void {
        this.editingRoom = { ...room };
    }

    saveRoomType(): void {
        if (this.editingRoom) {
            const index = this.roomTypes.findIndex(r => r.id === this.editingRoom!.id);
            if (index !== -1) {
                this.roomTypes[index] = { ...this.editingRoom };
                this.snackBar.open(`${this.editingRoom.type} pricing updated successfully!`, 'Close', {
                    duration: 3000,
                    verticalPosition: 'bottom',
                    horizontalPosition: 'center'
                });
                this.editingRoom = null;
            }
        }
    }

    cancelEdit(): void {
        this.editingRoom = null;
    }

    getAmenitiesString(amenities: string[]): string {
        return amenities.join(', ');
    }
}
