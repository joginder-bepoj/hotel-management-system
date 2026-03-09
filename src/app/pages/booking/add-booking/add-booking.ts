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
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-booking',
  templateUrl: './add-booking.html',
  styleUrls: ['./add-booking.scss'],
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
  ],
  schemas: []
})
export class AddBookingComponent {
  bookingForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.bookingForm = this.fb.group({
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
      purpose: [''],
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
      address: [''],
      uploadFile: [''],
      note: ['']
    });
  }

  onSubmit() {
    if (this.bookingForm.valid) {
      this.bookingService.addBooking(this.bookingForm.value);
      Swal.fire({
        title: 'Booked!',
        text: 'Booking added successfully!',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        this.router.navigate(['/booking/all-booking']);
      });
    }
  }
}
