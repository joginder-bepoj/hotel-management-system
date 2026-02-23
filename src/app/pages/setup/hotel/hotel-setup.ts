import { Component, inject, OnInit } from '@angular/core';
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
    MatExpansionModule
  ],
  templateUrl: './hotel-setup.html',
  styleUrls: ['./hotel-setup.scss']
})
export class HotelSetupComponent implements OnInit {
  private _formBuilder = inject(FormBuilder);
  private _hotelService = inject(HotelService);
  private _router = inject(Router);

  basicDetailsForm: FormGroup = this._formBuilder.group({
    hotelName: ['', Validators.required],
    address: ['', Validators.required],
    contactNumber: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    rating: ['']
  });

  roomsForm: FormGroup = this._formBuilder.group({
    roomTypes: this._formBuilder.array([])
  });

  amenitiesForm: FormGroup = this._formBuilder.group({
    general: [[]],
    foodAndBeverage: [[]],
    wellness: [[]],
    business: [[]]
  });

  pricingForm: FormGroup = this._formBuilder.group({
    basePrice: ['', [Validators.required, Validators.min(0)]],
    weekendPricing: ['', Validators.min(0)],
    seasonalPricing: ['', Validators.min(0)],
    extraGuestCharge: ['', Validators.min(0)],
    taxPercentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
    promoCode: ['']
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

    // Automatically set check-out time based on check-in time
    this.policiesForm.get('checkInTime')!.valueChanges.subscribe(value => {
      if (value) {
        this.policiesForm.get('checkOutTime')!.setValue(value, { emitEvent: false });
      }
    });
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
      size: [''],
      amenities: [[]]
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
  generalAmenities = ['Wi-Fi', 'Parking', 'Lift', '24h Front Desk', 'Security'];
  foodAmenities = ['Restaurant', 'Bar', 'Room Service', 'Breakfast Included'];
  wellnessAmenities = ['Gym', 'Spa', 'Pool', 'Yoga Center'];
  businessAmenities = ['Conference Room', 'Banquet Hall', 'Business Center'];

  toggleAmenity(category: string, amenity: string) {
    const control = this.amenitiesForm.get(category);
    if (control) {
      const current = control.value as string[];
      if (current.includes(amenity)) {
        control.setValue(current.filter(a => a !== amenity));
      } else {
        control.setValue([...current, amenity]);
      }
    }
  }

  isAmenitySelected(category: string, amenity: string): boolean {
    return (this.amenitiesForm.get(category)?.value as string[]).includes(amenity);
  }

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
    if (this.basicDetailsForm.valid && this.roomsForm.valid && this.pricingForm.valid && this.policiesForm.valid) {
      const basicDetails = this.basicDetailsForm.value;
      const rooms = this.roomsForm.value;
      const amenities = this.amenitiesForm.value;
      const pricing = this.pricingForm.value;
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
        
        // Step 2: Rooms & Inventory
        room_types: rooms.roomTypes,
        total_rooms: rooms.roomTypes.reduce((acc: number, rt: any) => acc + (rt.totalRooms || 0), 0),
        
        // Step 3: Amenities
        amenities: [
          ...amenities.general,
          ...amenities.foodAndBeverage,
          ...amenities.wellness,
          ...amenities.business
        ],
        categorized_amenities: amenities,

        // Step 4: Pricing
        base_room_price: pricing.basePrice,
        weekday_pricing: pricing.basePrice, // default
        weekend_pricing: pricing.weekendPricing || pricing.basePrice,
        seasonal_pricing: pricing.seasonalPricing || pricing.basePrice,
        extra_guest_charge: pricing.extraGuestCharge,
        tax_percentage: pricing.taxPercentage,
        promo_codes: pricing.promoCode ? [pricing.promoCode] : [],

        // Step 5: Policies
        check_in_time: policies.checkInTime,
        check_out_time: policies.checkOutTime,
        cancellation_policy: policies.cancellationPolicy,
        no_show_policy: policies.noShowPolicy,
        child_extra_bed_policy: policies.childExtraBedPolicy,
        pet_policy: policies.petPolicy,

        // Step 7: Staff
        staff_accounts: staff.staffAccounts,

        // Media
        gst_tax_id: media.gstId,
        image_count: this.selectedImages.length,
        doc_count: this.selectedDocs.length,
        created_at: new Date().toISOString()
      };

      this._hotelService.addHotel(hotelData).subscribe(success => {
        if (success) {
          alert('Hotel Setup Completed!');
          this._router.navigate(['/dashboard']);
        } else {
          alert('Failed to save details. Please try again.');
        }
      });
      
    } else {
      console.log('Form is invalid');
      this.markFormGroupTouched(this.basicDetailsForm);
      this.markFormGroupTouched(this.roomsForm);
      this.markFormGroupTouched(this.pricingForm);
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
