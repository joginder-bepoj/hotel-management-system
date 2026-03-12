import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { RestaurantService, MenuItem } from '../../../core/services/restaurant.service';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MenuItemDialogComponent } from './menu-item-dialog/menu-item-dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.html',
  styleUrls: ['./menu.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    BreadcrumbComponent,
    MatDialogModule
  ]
})
export class MenuComponent implements OnInit, OnDestroy {
  menuItems: MenuItem[] = [];
  filteredItems: MenuItem[] = [];
  categories: string[] = ['Starters', 'Main Course', 'Beverages', 'Desserts'];
  selectedCategory: string = 'All';
  private subscriptions = new Subscription();

  constructor(
    private restaurantService: RestaurantService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.subscriptions.add(
      this.restaurantService.menuItems$.subscribe(items => {
        this.menuItems = items;
        this.filterCategory(this.selectedCategory); // re-apply current filter
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  filterCategory(category: string) {
    this.selectedCategory = category;
    if (category === 'All') {
      this.filteredItems = [...this.menuItems];
    } else {
      this.filteredItems = this.menuItems.filter(item => item.category === category);
    }
  }

  toggleItemStatus(item: MenuItem, event: any) {
    const updatedItem = { ...item, isActive: event.checked };
    this.restaurantService.updateMenuItem(updatedItem);
  }

  addItem() {
    const dialogRef = this.dialog.open(MenuItemDialogComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.restaurantService.addMenuItem(result);
        Swal.fire({
          title: 'Success!',
          text: 'Menu item added successfully.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  }

  editItem(item: MenuItem) {
    const dialogRef = this.dialog.open(MenuItemDialogComponent, {
      width: '400px',
      data: { item }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.restaurantService.updateMenuItem({ ...item, ...result });
        Swal.fire({
          title: 'Updated!',
          text: 'Menu item updated successfully.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  }
}
