import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { RoomService } from '../../../core/service/room.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.html',
  styleUrls: ['./add-room.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    BreadcrumbComponent,
  ]
})
export class AddRoomComponent {
  roomForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private roomService: RoomService,
    private router: Router
  ) {
    this.roomForm = this.fb.group({
      roomNo: ['', [Validators.required]],
      floor: ['', [Validators.required]],
      roomType: ['', [Validators.required]],
      acNonAc: ['', [Validators.required]],
      meal: ['', [Validators.required]],
      capacity: ['', [Validators.required]],
      rent: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.roomForm.valid) {
      this.roomService.addRoom(this.roomForm.value);
      Swal.fire({
        title: 'Success!',
        text: 'Room added successfully!',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        this.router.navigate(['/rooms/all-rooms']);
      });
    }
  }

  onCancel() {
    this.router.navigate(['/rooms/all-rooms']);
  }
}
