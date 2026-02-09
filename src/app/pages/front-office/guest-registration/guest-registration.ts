import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
    selector: 'app-guest-registration',
    templateUrl: './guest-registration.html',
    standalone: true,
    imports: [
        CommonModule,
        BreadcrumbComponent,
        ReactiveFormsModule,
        FormsModule,
        MatStepperModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule
    ]
})
export class GuestRegistrationComponent {
    personalFormGroup: FormGroup;
    identityFormGroup: FormGroup;
    addressFormGroup: FormGroup;
    preferenceFormGroup: FormGroup;

    constructor(private _formBuilder: FormBuilder) {
        this.personalFormGroup = this._formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', Validators.required],
            dob: ['', Validators.required]
        });
        this.identityFormGroup = this._formBuilder.group({
            idType: ['', Validators.required],
            idNumber: ['', Validators.required],
            expiryDate: ['']
        });
        this.addressFormGroup = this._formBuilder.group({
            street: ['', Validators.required],
            city: ['', Validators.required],
            state: ['', Validators.required],
            zip: ['', Validators.required],
            country: ['', Validators.required]
        });
        this.preferenceFormGroup = this._formBuilder.group({
            roomType: ['', Validators.required],
            specialRequests: ['']
        });
    }

    onSubmit() {
        console.log('Registration Submitted');
        // Combine all form data and submit
    }
}
