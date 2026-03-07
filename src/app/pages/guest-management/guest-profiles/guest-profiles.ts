import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

export interface Guest {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    nationality: string;
    idType: string;
    idNumber: string;
    memberSince: Date;
    tier: 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
    totalStays: number;
    totalSpent: number;
    lastStay: Date | null;
    avatar: string;
}

interface StayHistory {
    bookingId: string;
    roomNo: string;
    checkIn: Date;
    checkOut: Date;
    amount: number;
    status: 'Completed' | 'Cancelled' | 'No Show';
}

@Component({
    selector: 'app-guest-profiles',
    templateUrl: './guest-profiles.html',
    styleUrls: ['./guest-profiles.scss'],
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
        MatChipsModule,
        MatTabsModule,
        FormsModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule
    ]
})
export class GuestProfilesComponent implements OnInit {
    searchQuery: string = '';
    guests: Guest[] = [
        {
            id: 'GST-1001',
            fullName: 'Alice Green',
            email: 'alice.g@example.com',
            phone: '+91 98765 43210',
            nationality: 'Indian',
            idType: 'Aadhaar',
            idNumber: 'XXXX-XXXX-1234',
            memberSince: new Date('2023-01-15'),
            tier: 'Platinum',
            totalStays: 12,
            totalSpent: 125000,
            lastStay: new Date('2024-02-05'),
            avatar: 'https://www.einfosoft.com/templates/admin/spiceangular/source/light/assets/images/user/user1.jpg'
        },
        {
            id: 'GST-1002',
            fullName: 'Robert White',
            email: 'robert.w@example.com',
            phone: '+44 7700 900077',
            nationality: 'British',
            idType: 'Passport',
            idNumber: 'P12345678',
            memberSince: new Date('2023-05-20'),
            tier: 'Gold',
            totalStays: 5,
            totalSpent: 45000,
            lastStay: new Date('2024-01-10'),
            avatar: 'https://www.einfosoft.com/templates/admin/spiceangular/source/light/assets/images/user/user2.jpg'
        },
        {
            id: 'GST-1003',
            fullName: 'Priya Sharma',
            email: 'priya.s@example.com',
            phone: '+91 99887 76655',
            nationality: 'Indian',
            idType: 'Driving License',
            idNumber: 'DL-MH-01-202020',
            memberSince: new Date('2023-11-05'),
            tier: 'Silver',
            totalStays: 2,
            totalSpent: 15000,
            lastStay: new Date('2023-12-25'),
            avatar: 'https://www.einfosoft.com/templates/admin/spiceangular/source/light/assets/images/user/user3.jpg'
        }
    ];

    filteredGuests: Guest[] = [];
    selectedGuest: Guest | null = null;

    // Form state
    isFormOpen: boolean = false;
    guestForm: FormGroup;

    // Mock history data linked to the selected guest
    guestHistory: StayHistory[] = [
        { bookingId: 'BK-5001', roomNo: '301', checkIn: new Date('2024-02-01'), checkOut: new Date('2024-02-05'), amount: 25000, status: 'Completed' },
        { bookingId: 'BK-4020', roomNo: '205', checkIn: new Date('2023-12-20'), checkOut: new Date('2023-12-23'), amount: 18000, status: 'Completed' },
        { bookingId: 'BK-3015', roomNo: '101', checkIn: new Date('2023-10-10'), checkOut: new Date('2023-10-12'), amount: 12000, status: 'Cancelled' }
    ];

    historyColumns: string[] = ['bookingId', 'roomNo', 'dates', 'amount', 'status'];

    constructor(private fb: FormBuilder) {
        this.guestForm = this.fb.group({
            id: [''],
            fullName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', Validators.required],
            nationality: ['', Validators.required],
            idType: ['', Validators.required],
            idNumber: ['', Validators.required],
            tier: ['Silver', Validators.required]
        });
    }

    ngOnInit(): void {
        this.filteredGuests = this.guests;
        if (this.guests.length > 0) {
            this.selectGuest(this.guests[0]);
        }
    }

    applyFilter(): void {
        const query = this.searchQuery.toLowerCase();
        this.filteredGuests = this.guests.filter(g =>
            g.fullName.toLowerCase().includes(query) ||
            g.phone.includes(query) ||
            g.email.toLowerCase().includes(query)
        );
    }

    selectGuest(guest: Guest): void {
        this.isFormOpen = false;
        this.selectedGuest = guest;
        // In a real app, we would fetch history here based on guest ID
    }

    getTierColor(tier: string): string {
        switch (tier) {
            case 'Diamond': return 'warn';
            case 'Platinum': return 'primary';
            case 'Gold': return 'accent';
            case 'Silver': return ''; // Default
            default: return '';
        }
    }

    addGuest(): void {
        this.isFormOpen = true;
        this.selectedGuest = null;
        this.guestForm.reset({
            id: '',
            tier: 'Silver'
        });
    }

    editGuest(guest: Guest): void {
        this.isFormOpen = true;
        this.selectedGuest = guest;
        this.guestForm.patchValue({
            id: guest.id,
            fullName: guest.fullName,
            email: guest.email,
            phone: guest.phone,
            nationality: guest.nationality,
            idType: guest.idType,
            idNumber: guest.idNumber,
            tier: guest.tier
        });
    }

    cancelForm(): void {
        this.isFormOpen = false;
        if (this.guests.length > 0 && !this.selectedGuest) {
            this.selectGuest(this.guests[0]);
        }
    }

    saveGuest(): void {
        if (this.guestForm.valid) {
            const formValue = this.guestForm.value;
            if (formValue.id) {
                // Edit existing
                const index = this.guests.findIndex(g => g.id === formValue.id);
                if (index !== -1) {
                    this.guests[index] = {
                        ...this.guests[index],
                        ...formValue
                    };
                    this.selectedGuest = this.guests[index];
                }
            } else {
                // Add new
                const nextIdStr = (this.guests.length + 1001).toString();
                const newGuest: Guest = {
                    ...formValue,
                    id: 'GST-' + nextIdStr,
                    memberSince: new Date(),
                    totalStays: 0,
                    totalSpent: 0,
                    lastStay: null,
                    avatar: 'https://www.einfosoft.com/templates/admin/spiceangular/source/light/assets/images/user/usrbig1.jpg'
                };
                this.guests.unshift(newGuest);
                this.selectedGuest = newGuest;
            }
            this.applyFilter();
            this.isFormOpen = false;
        }
    }
}
