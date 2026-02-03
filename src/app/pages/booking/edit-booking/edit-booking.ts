import { Component, OnInit } from '@angular/core';
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
import { Booking, BookingService } from '../../../core/service/booking.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-booking',
  templateUrl: './edit-booking.html',
  styleUrls: ['./edit-booking.scss'],
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
export class EditBookingComponent implements OnInit {
  bookingForm: FormGroup;
  bookingId: number | null = null;
  existingBooking: Booking | undefined;

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private route: ActivatedRoute,
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
      address: [''],
      uploadFile: [''],
      note: ['']
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.bookingId = +id;
        this.loadBooking(this.bookingId);
      }
    });
  }

  loadBooking(id: number) {
    this.existingBooking = this.bookingService.getBooking(id);
    if (this.existingBooking) {
      this.bookingForm.patchValue({
        first: this.existingBooking.first,
        last: this.existingBooking.last,
        email: this.existingBooking.email,
        gender: this.existingBooking.gender,
        mobile: this.existingBooking.mobile,
        city: this.existingBooking.city,
        arriveDate: this.existingBooking.arriveDate,
        departDate: this.existingBooking.departDate,
        totalPerson: this.existingBooking.totalPerson,
        roomType: this.existingBooking.roomType,
        address: this.existingBooking.address,
        note: this.existingBooking.note,
        // File upload handling might be limited for now as we can't easily prepopulate file inputs, 
        // but we can assume string path or skip it for this demo.
      });
    } else {
      this.snackBar.open('Booking not found!', 'Close', { duration: 3000 });
      this.router.navigate(['/booking/all-booking']);
    }
  }

  onSubmit() {
    if (this.bookingForm.valid && this.existingBooking) {
      const updatedBooking: Booking = {
        ...this.existingBooking,
        ...this.bookingForm.value
      };
      this.bookingService.updateBooking(updatedBooking);
      this.snackBar.open('Booking updated successfully!', 'Close', {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center'
      });
      this.router.navigate(['/booking/all-booking']);
    }
  }

  onCancel() {
    this.router.navigate(['/booking/all-booking']);
  }
}
