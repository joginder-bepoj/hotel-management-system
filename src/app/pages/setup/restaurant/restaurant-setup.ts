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

  menuForm: FormGroup = this._formBuilder.group({
    menuItems: this._formBuilder.array([])
  });

  timingsForm: FormGroup = this._formBuilder.group({
    openTime: ['', Validators.required],
    closeTime: ['', Validators.required],
    tableCount: ['', Validators.required],
    seatingCapacity: ['']
  });

  constructor() {
    // Add one initial menu item
    this.addMenuItem();
  }

  get menuItems() {
    return this.menuForm.get('menuItems') as FormArray;
  }

  addMenuItem() {
    const itemForm = this._formBuilder.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      price: ['', Validators.required],
      isVeg: [false]
    });
    this.menuItems.push(itemForm);
  }

  removeMenuItem(index: number) {
    this.menuItems.removeAt(index);
  }

  onSubmit() {
    if (this.basicInfoForm.valid && this.menuForm.valid && this.timingsForm.valid) {
      const setupData = {
        ...this.basicInfoForm.value,
        menuItems: this.menuForm.value.menuItems,
        ...this.timingsForm.value
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
      this.markFormGroupTouched(this.menuForm);
      this.markFormGroupTouched(this.timingsForm);
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
