import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { FileUploadComponent } from '../../../components/file-upload/file-upload.component';
import { MatIconModule } from '@angular/material/icon';
import { BookingService } from '../../../core/service/booking.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-online-reservation',
    templateUrl: './online-reservation.html',
    styleUrls: ['./online-reservation.scss'],
    standalone: true,
    providers: [provideNativeDateAdapter()],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatDatepickerModule,
        BreadcrumbComponent,
        FileUploadComponent,
        MatNativeDateModule,
        MatIconModule,
    ]
})
export class OnlineReservationComponent {
    reservationForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private bookingService: BookingService,
        private router: Router,
        private snackBar: MatSnackBar
    ) {
        this.reservationForm = this.fb.group({
            first: ['', [Validators.required]],
            last: [''],
            email: ['', [Validators.required, Validators.email]],
            gender: ['', [Validators.required]],
            mobile: ['', [Validators.required]],
            city: ['', [Validators.required]],
            arriveDate: ['', [Validators.required]],
            departDate: ['', [Validators.required]],
            totalPerson: ['', [Validators.required]],
            roomType: ['', [Validators.required]],
            roomNo: [''],
            vehicleNo: [''],
            nationality: [''],
            purpose: [''],
            passportNo: [''],
            arrivalFrom: [''],
            departureTo: [''],
            noOfAdults: [''],
            noOfChildren: [''],
            accompanying: [''],
            ratePerDay: [''],
            totalRent: [''],
            advance: [''],
            balance: [''],
            idProofNo: [''],
            dob: [''],
            anniversary: [''],
            address: [''],
            uploadFile: [''],
            note: ['']
        });
    }

    onSubmit() {
        if (this.reservationForm.valid) {
            this.bookingService.addBooking(this.reservationForm.value);
            this.snackBar.open('Online Reservation submitted successfully!', 'Close', {
                duration: 3000,
                verticalPosition: 'bottom',
                horizontalPosition: 'center'
            });
            this.router.navigate(['/booking/all-booking']);
        }
    }
}
