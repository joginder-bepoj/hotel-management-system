import { Component, inject } from '@angular/core';
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
import { ApartmentService } from '../../../core/services/apartment.service';

@Component({
  selector: 'app-apartment-setup',
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
  templateUrl: './apartment-setup.html',
  styleUrls: ['./apartment-setup.scss']
})
export class ApartmentSetupComponent {
  private _formBuilder = inject(FormBuilder);
  private _apartmentService = inject(ApartmentService);
  private _router = inject(Router);

  basicInfoForm: FormGroup = this._formBuilder.group({
    apartmentName: ['', Validators.required],
    address: ['', Validators.required],
    ownerName: ['', Validators.required],
    ownerContact: ['', Validators.required]
  });

  detailsForm: FormGroup = this._formBuilder.group({
    bedroomCount: ['', Validators.required],
    bathroomCount: ['', Validators.required],
    areaSize: [''],
    facilityWifi: [false],
    facilityParking: [false],
    facilityAc: [false],
    facilityKitchen: [false],
    facilityTv: [false],
    facilityWashingMachine: [false]
  });

  pricingForm: FormGroup = this._formBuilder.group({
    rent: ['', Validators.required],
    deposit: [''],
    houseRules: ['']
  });

  onSubmit() {
    if (this.basicInfoForm.valid && this.detailsForm.valid && this.pricingForm.valid) {
      const setupData = {
        ...this.basicInfoForm.value,
        ...this.detailsForm.value,
        ...this.pricingForm.value
      };
      
      this._apartmentService.saveApartmentDetails(setupData).subscribe(success => {
        if (success) {
          alert('Apartment Setup Completed!');
          this._router.navigate(['/dashboard']);
        } else {
          alert('Failed to save details. Please try again.');
        }
      });
      
    } else {
      console.log('Form is invalid');
      this.markFormGroupTouched(this.basicInfoForm);
      this.markFormGroupTouched(this.detailsForm);
      this.markFormGroupTouched(this.pricingForm);
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
