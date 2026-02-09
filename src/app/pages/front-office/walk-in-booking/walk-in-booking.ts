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

    constructor(private fb: FormBuilder) {
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
            console.log('Walk-in Booking Submitted', this.bookingForm.value);
        }
    }
}
