import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MenuItem } from '../../../../core/services/restaurant.service';

@Component({
  selector: 'app-menu-item-dialog',
  templateUrl: './menu-item-dialog.html',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    ReactiveFormsModule
  ]
})
export class MenuItemDialogComponent {
  itemForm: FormGroup;
  categories: string[] = ['Starters', 'Main Course', 'Beverages', 'Desserts'];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<MenuItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { item?: MenuItem }
  ) {
    this.itemForm = this.fb.group({
      name: [data.item?.name || '', Validators.required],
      category: [data.item?.category || '', Validators.required],
      price: [data.item?.price || '', [Validators.required, Validators.min(1)]],
      isActive: [data.item !== undefined ? data.item.isActive : true]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.itemForm.valid) {
      this.dialogRef.close(this.itemForm.value);
    }
  }
}
