import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { Room, RoomService } from '../../../core/service/room.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-room',
  templateUrl: './edit-room.html',
  styleUrls: ['./edit-room.scss'],
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
export class EditRoomComponent implements OnInit {
  roomForm: FormGroup;
  roomId: number | null = null;
  existingRoom: Room | undefined;

  constructor(
    private fb: FormBuilder,
    private roomService: RoomService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
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

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.roomId = +id;
        this.loadRoom(this.roomId);
      }
    });
  }

  loadRoom(id: number) {
    this.existingRoom = this.roomService.getRooms().find(r => r.id === id);
    if (this.existingRoom) {
      this.roomForm.patchValue({
        roomNo: this.existingRoom.roomNo,
        floor: (this.existingRoom as any).floor || 'Ground Floor',
        roomType: this.existingRoom.roomType,
        acNonAc: this.existingRoom.acNonAc,
        meal: this.existingRoom.meal,
        capacity: this.existingRoom.capacity,
        rent: this.existingRoom.rent
      });
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Room not found!',
        icon: 'error',
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        this.router.navigate(['/rooms/all-rooms']);
      });
    }
  }

  onSubmit() {
    if (this.roomForm.valid && this.existingRoom) {
      const updatedRoom: Room = {
        ...this.existingRoom,
        ...this.roomForm.value
      };
      this.roomService.updateRoom(updatedRoom);
      Swal.fire({
        title: 'Updated!',
        text: 'Room updated successfully!',
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
