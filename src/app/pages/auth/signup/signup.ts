
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

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
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      otp: [''],
    });
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      const { password, confirmPassword } = this.signupForm.value;
      if (password !== confirmPassword) {
        this.error = 'Passwords do not match';
        return;
      }
      
      this.isLoading = true;
      this.error = '';
      
      const userData = {
        ...this.signupForm.value,
        confirm_password: confirmPassword
      };

      this.authService.register(userData).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.showOtpSection = true;
          console.log('Registration success', res);
        },
        error: (err) => {
          this.isLoading = false;
          this.error = err.error?.message || 'Registration failed';
          console.error('Registration error', err);
        }
      });
    }
  }

  resendOtp(): void {
    const { email } = this.signupForm.value;
    this.isLoading = true;
    this.authService.resendOtp(email).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.error = '';
        // Optionally show a success message
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.message || 'Failed to resend OTP';
      }
    });
  }

  verifyOtp(): void {
    const { email, otp } = this.signupForm.value;
    if (!otp) {
      this.error = 'Please enter OTP';
      return;
    }

    this.isLoading = true;
    this.authService.verifyOtp(email, otp).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.router.navigate(['/authentication/login']);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.message || 'Invalid OTP';
      }
    });
  }
}
