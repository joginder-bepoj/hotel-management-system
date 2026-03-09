import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
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
    selector: 'app-guest-registration',
    templateUrl: './guest-registration.html',
    standalone: true,
    imports: [
        CommonModule,
        BreadcrumbComponent,
        ReactiveFormsModule,
        FormsModule,
        MatStepperModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule
    ]
})
export class GuestRegistrationComponent {
    personalFormGroup: FormGroup;
    identityFormGroup: FormGroup;
    addressFormGroup: FormGroup;
    preferenceFormGroup: FormGroup;

    constructor(
        private _formBuilder: FormBuilder,
        private bookingService: BookingService,
        private router: Router
    ) {
        this.personalFormGroup = this._formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', Validators.required],
            dob: ['', Validators.required]
        });
        this.identityFormGroup = this._formBuilder.group({
            idType: ['', Validators.required],
            idNumber: ['', Validators.required],
            expiryDate: ['']
        });
        this.addressFormGroup = this._formBuilder.group({
            street: ['', Validators.required],
            city: ['', Validators.required],
            state: ['', Validators.required],
            zip: ['', Validators.required],
            country: ['', Validators.required]
        });
        this.preferenceFormGroup = this._formBuilder.group({
            roomType: ['', Validators.required],
            specialRequests: ['']
        });
    }

    onSubmit() {
        if (this.personalFormGroup.valid && this.identityFormGroup.valid && this.addressFormGroup.valid && this.preferenceFormGroup.valid) {
            const personal = this.personalFormGroup.value;
            const pref = this.preferenceFormGroup.value;
            const addr = this.addressFormGroup.value;

            const bookingData: Partial<Booking> = {
                first: personal.firstName,
                last: personal.lastName,
                email: personal.email,
                mobile: personal.phone,
                dob: personal.dob,
                idProofNo: this.identityFormGroup.value.idNumber,
                address: `${addr.street}, ${addr.city}, ${addr.state} ${addr.zip}, ${addr.country}`,
                roomType: pref.roomType,
                note: pref.specialRequests,
                arriveDate: new Date(),
                departDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Default 1 day
                totalPerson: 1,
                city: addr.city,
                payment: 'Unpaid'
            };

            this.bookingService.addBooking(bookingData as Booking);

            Swal.fire({
                title: 'Registered!',
                text: 'Guest record created successfully.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                this.router.navigate(['/booking/all-booking']);
            });
        }
    }
}
