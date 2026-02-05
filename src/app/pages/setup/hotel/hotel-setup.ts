import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
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
    MatIconModule
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

  configurationForm: FormGroup = this._formBuilder.group({
    floors: ['', Validators.required],
    rooms: ['', Validators.required],
    roomTypes: [''],
    amenityWifi: [false],
    amenityParking: [false],
    amenityPool: [false],
    amenityGym: [false],
    amenityRestaurant: [false],
    amenityRoomService: [false]
  });

  pricingForm: FormGroup = this._formBuilder.group({
    roomPrices: this._formBuilder.group({}),
    seasonalMultiplier: [''],
    discount: ['']
  });

  roomTypesList: string[] = [];

  ngOnInit() {
    // Initialize with current value
    this.updateRoomPrices(this.configurationForm.get('roomTypes')!.value);
    
    this.configurationForm.get('roomTypes')!.valueChanges.subscribe(value => {
      this.updateRoomPrices(value);
    });
  }

  updateRoomPrices(roomTypesStr: string) {
    const types = roomTypesStr.split(',').map(t => t.trim()).filter(t => t !== '');
    this.roomTypesList = [...new Set(types)]; // Unique types

    const roomPricesGroup = this.pricingForm.get('roomPrices') as FormGroup;
    
    // Get current controls
    const currentControls = Object.keys(roomPricesGroup.controls);
    
    // Add new controls
    this.roomTypesList.forEach(type => {
      if (!roomPricesGroup.contains(type)) {
        roomPricesGroup.addControl(type, this._formBuilder.control('', Validators.required));
      }
    });

    // Remove old controls
    currentControls.forEach(controlName => {
      if (!this.roomTypesList.includes(controlName)) {
        roomPricesGroup.removeControl(controlName);
      }
    });
  }

  policiesForm: FormGroup = this._formBuilder.group({
    checkInTime: ['', Validators.required],
    checkOutTime: ['', Validators.required],
    cancellationPolicy: ['']
  });

  mediaForm: FormGroup = this._formBuilder.group({
    gstId: ['']
  });

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
    if (this.basicDetailsForm.valid && this.configurationForm.valid && this.pricingForm.valid && this.policiesForm.valid) {
      const setupData = {
        ...this.basicDetailsForm.value,
        ...this.configurationForm.value,
        ...this.pricingForm.value,
        ...this.policiesForm.value,
        ...this.mediaForm.value,
        // In a real app, we would upload files and save URLs. 
        // Here we just store the names for demo purposes.
        images: this.selectedImages.map(f => f.name),
        documents: this.selectedDocs.map(f => f.name)
      };
      
      this._hotelService.saveHotelDetails(setupData).subscribe(success => {
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
      this.markFormGroupTouched(this.configurationForm);
      this.markFormGroupTouched(this.pricingForm);
      this.markFormGroupTouched(this.policiesForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
