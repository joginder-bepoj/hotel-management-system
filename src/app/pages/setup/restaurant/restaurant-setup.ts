import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { RestaurantService } from '../../../core/services/restaurant.service';

@Component({
  selector: 'app-restaurant-setup',
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
  templateUrl: './restaurant-setup.html',
  styleUrls: ['./restaurant-setup.scss']
})
export class RestaurantSetupComponent {
  private _formBuilder = inject(FormBuilder);
  private _restaurantService = inject(RestaurantService);
  private _router = inject(Router);

  basicInfoForm: FormGroup = this._formBuilder.group({
    restaurantName: ['', Validators.required],
    location: ['', Validators.required],
    contactNumber: ['', Validators.required],
    email: ['', [Validators.email]]
  });

  onSubmit() {
    if (this.basicInfoForm.valid) {
      const setupData = {
        ...this.basicInfoForm.value,
        // Default values for fields removed from UI (to be configured later in dashboard)
        menuItems: [],
        openTime: '09:00',
        closeTime: '22:00',
        tableCount: 1,
        seatingCapacity: 4
      };
      
      this._restaurantService.saveRestaurantDetails(setupData).subscribe(success => {
        if (success) {
          alert('Restaurant Setup Completed!');
          this._router.navigate(['/dashboard']);
        } else {
          alert('Failed to save details. Please try again.');
        }
      });
      
    } else {
      console.log('Form is invalid');
      this.markFormGroupTouched(this.basicInfoForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
      if (control instanceof FormArray) {
        control.controls.forEach(c => this.markFormGroupTouched(c as FormGroup));
      }
    });
  }
}
