import { Component, inject, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { HotelService } from '../../../core/services/hotel.service';
import { MatStepper } from '@angular/material/stepper';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hotel-setup',
  standalone: true,
  imports: [
    CommonModule,
    MatStepperModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatChipsModule,
    MatIconModule,
    MatExpansionModule,
    HttpClientModule
  ],
  templateUrl: './hotel-setup.html',
  styleUrls: ['./hotel-setup.scss']
})
export class HotelSetupComponent implements OnInit, AfterViewInit, OnDestroy {
  private _formBuilder = inject(FormBuilder);
  private _hotelService = inject(HotelService);
  private _router = inject(Router);
  private _http = inject(HttpClient);

  @ViewChild('stepper') stepper!: MatStepper;

  basicDetailsForm: FormGroup = this._formBuilder.group({
    hotelName: ['', Validators.required],
    address: ['', Validators.required],
    contactNumber: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    rating: ['']
  });

  // locationForm: FormGroup = this._formBuilder.group({
  //   latitude: ['', Validators.required],
  //   longitude: ['', Validators.required],
  //   displayAddress: ['']
  // });

  roomsForm: FormGroup = this._formBuilder.group({
    roomTypes: this._formBuilder.array([])
  });





  policiesForm: FormGroup = this._formBuilder.group({
    checkInTime: ['', Validators.required],
    checkOutTime: ['', Validators.required],
    cancellationPolicy: [''],
    noShowPolicy: [''],
    childExtraBedPolicy: [''],
    petPolicy: ['No Pets Allowed']
  });

  staffForm: FormGroup = this._formBuilder.group({
    staffAccounts: this._formBuilder.array([])
  });

  mediaForm: FormGroup = this._formBuilder.group({
    gstId: ['']
  });

  ngOnInit() {
    // Add an initial room type
    this.addRoomType();
    // Add an initial staff account
    this.addStaffAccount();
  }

  ngAfterViewInit() {
    // Other logic if needed
  }

  ngOnDestroy() {
    // Other logic if needed
  }

  get roomTypes() {
    return this.roomsForm.get('roomTypes') as FormArray;
  }

  get staffAccounts() {
    return this.staffForm.get('staffAccounts') as FormArray;
  }

  addRoomType() {
    const roomTypeGroup = this._formBuilder.group({
      name: ['', Validators.required],
      totalRooms: [1, [Validators.required, Validators.min(1)]],
      bedType: ['Single', Validators.required],
      maxOccupancy: [2, [Validators.required, Validators.min(1)]],
      size: ['']
    });
    this.roomTypes.push(roomTypeGroup);
  }

  removeRoomType(index: number) {
    if (this.roomTypes.length > 1) {
      this.roomTypes.removeAt(index);
    }
  }

  addStaffAccount() {
    const staffGroup = this._formBuilder.group({
      fullName: ['', Validators.required],
      role: ['Receptionist', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      permissions: [[]]
    });
    this.staffAccounts.push(staffGroup);
  }

  removeStaffAccount(index: number) {
    if (this.staffAccounts.length > 1) {
      this.staffAccounts.removeAt(index);
    }
  }

  // Amenities list




  selectedImages: File[] = [];
  selectedDocs: File[] = [];

  onFileSelected(event: any, type: 'images' | 'docs') {
    if (event.target.files && event.target.files.length) {
      const files = Array.from(event.target.files) as File[];
      if (type === 'images') {
        this.selectedImages = [...this.selectedImages, ...files];
      } else {
        this.selectedDocs = [...this.selectedDocs, ...files];
      }
    }
  }

  onSubmit() {
    if (this.basicDetailsForm.valid && this.roomsForm.valid && this.policiesForm.valid) {
      const basicDetails = this.basicDetailsForm.value;
      // const location = this.locationForm.value;
      const rooms = this.roomsForm.value;


      const policies = this.policiesForm.value;
      const staff = this.staffForm.value;
      const media = this.mediaForm.value;

      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : { id: 1 };

      const hotelData = {
        user_id: user.id || 1,
        hotel_name: basicDetails.hotelName,
        address: basicDetails.address,
        contact_number: basicDetails.contactNumber,
        email: basicDetails.email,
        rating: basicDetails.rating,
        
        // Location
        // latitude: location.latitude,
        // longitude: location.longitude,
        // map_address: location.displayAddress,
        
        // Step 2: Rooms & Inventory
        room_types: rooms.roomTypes,
        total_rooms: rooms.roomTypes.reduce((acc: number, rt: any) => acc + (rt.totalRooms || 0), 0),
        




        // Step 3: Policies
        check_in_time: policies.checkInTime,
        check_out_time: policies.checkOutTime,
        cancellation_policy: policies.cancellationPolicy,
        no_show_policy: policies.noShowPolicy,
        child_extra_bed_policy: policies.childExtraBedPolicy,
        pet_policy: policies.petPolicy,

        // Step 4: Staff
        staff_accounts: staff.staffAccounts,

        // Media
        gst_tax_id: media.gstId,
        image_count: this.selectedImages.length,
        doc_count: this.selectedDocs.length,
        created_at: new Date().toISOString()
      };

      this._hotelService.addHotel(hotelData).subscribe(success => {
        if (success) {
          Swal.fire({
            title: 'Setup Completed!',
            text: 'Hotel Setup Completed Successfully!',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            this._router.navigate(['/hotel-portfolio']);
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: 'Failed to save details. Please try again.',
            icon: 'error'
          });
        }
      });
      
    } else {
      console.log('Form is invalid');
      this.markFormGroupTouched(this.basicDetailsForm);
      // this.markFormGroupTouched(this.locationForm);
      this.markFormGroupTouched(this.roomsForm);
      this.markFormGroupTouched(this.policiesForm);
      this.markFormGroupTouched(this.staffForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
