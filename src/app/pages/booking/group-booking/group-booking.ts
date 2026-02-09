import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { MatIconModule } from '@angular/material/icon';
import { BookingService } from '../../../core/service/booking.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-group-booking',
    templateUrl: './group-booking.html',
    styleUrls: ['./group-booking.scss'],
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
        MatNativeDateModule,
        MatIconModule,
    ]
})
export class GroupBookingComponent {
    groupBookingForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private bookingService: BookingService,
        private router: Router,
        private snackBar: MatSnackBar
    ) {
        this.groupBookingForm = this.fb.group({
            groupName: ['', [Validators.required]],
            contactPerson: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            mobile: ['', [Validators.required]],
            arriveDate: ['', [Validators.required]],
            departDate: ['', [Validators.required]],
            totalRooms: ['', [Validators.required, Validators.min(1)]],
            totalGuests: ['', [Validators.required, Validators.min(1)]],
            roomType: ['', [Validators.required]],
            specialRequests: [''],
            advance: [''],
            note: ['']
        });
    }

    onSubmit() {
        if (this.groupBookingForm.valid) {
            const formValue = this.groupBookingForm.value;
            
            // Create a booking entry for the group
            const groupBooking = {
                id: 0, // Will be auto-assigned by service
                first: formValue.contactPerson,
                last: `(Group: ${formValue.groupName})`,
                email: formValue.email,
                gender: 'N/A',
                mobile: formValue.mobile,
                city: '',
                arriveDate: formValue.arriveDate,
                departDate: formValue.departDate,
                totalPerson: formValue.totalGuests,
                roomType: formValue.roomType,
                roomNo: `${formValue.totalRooms} rooms`,
                advance: formValue.advance || 0,
                address: '',
                uploadFile: '',
                payment: 'Unpaid',
                note: `Group Booking: ${formValue.groupName}. ${formValue.note || ''}. Special Requests: ${formValue.specialRequests || 'None'}`
            };

            this.bookingService.addBooking(groupBooking);
            this.snackBar.open('Group booking created successfully!', 'Close', {
                duration: 3000,
                verticalPosition: 'bottom',
                horizontalPosition: 'center'
            });
            this.router.navigate(['/booking/all-booking']);
        }
    }
}
