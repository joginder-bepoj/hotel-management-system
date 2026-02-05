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
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
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
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  hide = true;
  error = '';

  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.error = '';
      
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          this.isLoading = false;
          // User data might be in res.data or res
          const user = res.data || res;
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('token', res.token || res.access_token);
          
          if (user.is_setup_complete) {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/setup']);
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.error = err.error?.message || 'Invalid credentials';
        }
      });
    }
  }
}
