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
import Swal from 'sweetalert2';

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
      Swal.fire({
        title: 'Added!',
        text: 'Amenity added successfully!',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
      this.amenityForm.reset();
      this.loadAmenities();
    }
  }

  deleteAmenity(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.amenityService.deleteAmenity(id);
        this.loadAmenities();
        Swal.fire(
          'Deleted!',
          'Amenity has been deleted.',
          'success'
        );
      }
    });
  }
}
