
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.html',
  styleUrls: ['./signup.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
  ],
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  hide = true;
  error = '';
  showOtpSection = false;
  hardcodedOtp = '123456';

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      otp: [''],
    });
  }

  onSubmit(): void {
    if (this.signupForm.get('username')!.valid && this.signupForm.get('email')!.valid && this.signupForm.get('password')!.valid && this.signupForm.get('confirmPassword')!.valid) {
      const { password, confirmPassword } = this.signupForm.value;
      if (password !== confirmPassword) {
        this.error = 'Passwords do not match';
        return;
      }
      this.showOtpSection = true;
      this.error = '';
    }
  }

  verifyOtp(): void {
    const { username, email, password, otp } = this.signupForm.value;
    if (otp === this.hardcodedOtp) {
      localStorage.setItem('user', JSON.stringify({ username, email, password }));
      this.router.navigate(['/authentication/login']);
    } else {
      this.error = 'Invalid OTP';
    }
  }
}
