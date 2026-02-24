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
import { HotelService } from '../../../core/services/hotel.service';
import { inject } from '@angular/core';
import Swal from 'sweetalert2';

interface RoomTypePrice {
    id: any;
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
    private hotelService = inject(HotelService);
    private snackBar = inject(MatSnackBar);
    
    roomTypes: RoomTypePrice[] = [];
    activeHotel: any;


    editingRoom: RoomTypePrice | null = null;
    isAddingNew: boolean = false;

    constructor() { }

    ngOnInit(): void {
        this.loadRoomTypes();
    }

    loadRoomTypes(): void {
        this.activeHotel = this.hotelService.getActiveHotel();
        if (this.activeHotel && this.activeHotel.room_types) {
            // Map the room types from setup to RoomTypePrice interface
            this.roomTypes = this.activeHotel.room_types.map((rt: any) => ({
                id: rt.id || 'rt_' + Math.random().toString(36).substr(2, 9),
                type: rt.name || rt.type || 'Undefined',
                basePrice: rt.basePrice || rt.price || 0,
                weekendPrice: rt.weekendPrice || (rt.basePrice ? Math.round(rt.basePrice * 1.2) : 0),
                peakSeasonPrice: rt.peakSeasonPrice || (rt.basePrice ? Math.round(rt.basePrice * 1.5) : 0),
                amenities: rt.amenities || ['WiFi', 'TV'],
                maxOccupancy: rt.maxOccupancy || rt.occupancy || 2,
                description: rt.description || ''
            }));
        }
    }

    editRoomType(room: RoomTypePrice): void {
        this.editingRoom = { ...room };
        this.isAddingNew = false;
    }

    addNewRoomType(): void {
        this.isAddingNew = true;
        this.editingRoom = {
            id: Date.now(), // Unique ID
            type: '',
            basePrice: 0,
            weekendPrice: 0,
            peakSeasonPrice: 0,
            amenities: ['WiFi', 'TV'],
            maxOccupancy: 1,
            description: ''
        };
    }

    saveRoomType(): void {
        if (this.editingRoom) {
            if (this.isAddingNew) {
                this.roomTypes.push({ ...this.editingRoom });
            } else {
                const index = this.roomTypes.findIndex(r => r.id === this.editingRoom!.id);
                if (index !== -1) {
                    this.roomTypes[index] = { ...this.editingRoom };
                }
            }
            
            this.persistRoomTypes();
            
            Swal.fire({
                title: 'Success!',
                text: `${this.editingRoom.type} has been saved.`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
            
            this.isAddingNew = false;
            this.editingRoom = null;
        }
    }

    deleteRoomType(id: any): void {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            background: '#ffffff',
            customClass: {
                popup: 'swal2-popup-custom'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                this.roomTypes = this.roomTypes.filter(r => r.id !== id);
                this.persistRoomTypes();
                
                Swal.fire(
                    'Deleted!',
                    'Room type has been deleted.',
                    'success'
                );
            }
        });
    }

    private persistRoomTypes(): void {
        if (this.activeHotel) {
            // Map back to the structure used in setup
            this.activeHotel.room_types = this.roomTypes.map(rt => ({
                id: rt.id,
                name: rt.type,
                totalRooms: rt.maxOccupancy * 2, // Placeholder logic
                bedType: 'King', // Placeholder
                maxOccupancy: rt.maxOccupancy,
                basePrice: rt.basePrice,
                weekendPrice: rt.weekendPrice,
                peakSeasonPrice: rt.peakSeasonPrice,
                amenities: rt.amenities,
                description: rt.description
            }));
            
            this.hotelService.saveHotelDetails(this.activeHotel).subscribe();
        }
    }

    cancelEdit(): void {
        this.editingRoom = null;
        this.isAddingNew = false;
    }

    getAmenitiesString(amenities: string[]): string {
        return amenities.join(', ');
    }
}
