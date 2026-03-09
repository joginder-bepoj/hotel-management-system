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
import * as L from 'leaflet';
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

  @ViewChild('mapElement') mapElement!: ElementRef;
  @ViewChild('stepper') stepper!: MatStepper;
  private map?: L.Map;
  private marker?: L.Marker;
  searchQuery: string = '';
  searchResults: any[] = [];
  showSearchResults: boolean = false;

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

  private mapInitialized = false;

  ngAfterViewInit() {
    // Handle map initialization and resizing when step changes
    this.stepper.selectionChange.subscribe(event => {
      if (event.selectedIndex === 1) { // Location step
        setTimeout(() => {
          if (!this.mapInitialized) {
            this.initMap();
            this.mapInitialized = true;
          } else if (this.map) {
            this.map.invalidateSize();
          }
        }, 200);
      }
    });
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap() {
    // Standard Leaflet Icon fix for Angular/Webpack
    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
    const iconDefault = L.icon({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;

    this.map = L.map(this.mapElement.nativeElement).setView([20.5937, 78.9629], 5); // Default to India center

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.updateMarker(e.latlng.lat, e.latlng.lng);
    });
  }

  updateMarker(lat: number, lng: number, address?: string) {
    if (!this.map) return;

    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = L.marker([lat, lng]).addTo(this.map);
    }

    // this.locationForm.patchValue({
    //   latitude: lat,
    //   longitude: lng,
    //   displayAddress: address || `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`
    // });

    this.map.setView([lat, lng], 15);
  }

  searchLocation() {
    if (!this.searchQuery.trim()) return;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(this.searchQuery)}`;
    this._http.get<any[]>(url).subscribe(results => {
      this.searchResults = results;
      this.showSearchResults = results.length > 0;
    });
  }

  selectResult(result: any) {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    this.updateMarker(lat, lng, result.display_name);
    this.showSearchResults = false;
    this.searchQuery = result.display_name;
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
