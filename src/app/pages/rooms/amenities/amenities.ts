import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AmenityService, Amenity } from '../../../core/service/amenity.service';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-amenities',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatSnackBarModule,
    BreadcrumbComponent
  ],
  templateUrl: './amenities.html',
  styleUrls: ['./amenities.scss']
})
export class AmenitiesComponent implements OnInit {
  amenityForm: FormGroup;
  dataSource: Amenity[] = [];
  displayedColumns: string[] = ['name', 'icon', 'actions'];

  constructor(
    private fb: FormBuilder,
    private amenityService: AmenityService,
    private snackBar: MatSnackBar
  ) {
    this.amenityForm = this.fb.group({
      name: ['', [Validators.required]],
      icon: ['']
    });
  }

  ngOnInit(): void {
    this.loadAmenities();
  }

  loadAmenities(): void {
    this.dataSource = this.amenityService.getAmenities();
  }

  onSubmit(): void {
    if (this.amenityForm.valid) {
      this.amenityService.addAmenity(this.amenityForm.value);
      this.snackBar.open('Amenity added successfully!', 'Close', {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center'
      });
      this.amenityForm.reset();
      this.loadAmenities();
    }
  }

  deleteAmenity(id: number): void {
    if (confirm('Are you sure you want to delete this amenity?')) {
      this.amenityService.deleteAmenity(id);
      this.snackBar.open('Amenity deleted!', 'Close', {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center'
      });
      this.loadAmenities();
    }
  }
}
