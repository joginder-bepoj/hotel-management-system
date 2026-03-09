import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { BookingService, Booking } from '../../../core/service/booking.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-walk-in-booking',
    templateUrl: './walk-in-booking.html',
    standalone: true,
    imports: [
        CommonModule,
        BreadcrumbComponent,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule
    ]
})
export class WalkInBookingComponent {
    bookingForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private bookingService: BookingService,
        private router: Router
    ) {
        this.bookingForm = this.fb.group({
            checkInDate: [new Date(), Validators.required],
            checkOutDate: ['', Validators.required],
            guestCount: [1, [Validators.required, Validators.min(1)]],
            roomType: ['', Validators.required],
            guestName: ['', Validators.required],
            contact: ['', Validators.required]
        });
    }

    onSubmit() {
        if (this.bookingForm.valid) {
            const val = this.bookingForm.value;
            const names = val.guestName.split(' ');
            const firstName = names[0];
            const lastName = names.length > 1 ? names.slice(1).join(' ') : '';

            const bookingData: Partial<Booking> = {
                first: firstName,
                last: lastName,
                mobile: val.contact,
                arriveDate: val.checkInDate,
                departDate: val.checkOutDate,
                totalPerson: val.guestCount,
                roomType: val.roomType,
                email: '', // Not required for walk-in
                city: 'Local',
                payment: 'Unpaid'
            };

            this.bookingService.addBooking(bookingData as Booking);

            Swal.fire({
                title: 'Success!',
                text: 'Walk-in booking created. Please assign a room in Room Allocation.',
                icon: 'success',
                confirmButtonText: 'Go to Allocation'
            }).then(() => {
                this.router.navigate(['/front-office/room-allocation']);
            });
        }
    }
}
