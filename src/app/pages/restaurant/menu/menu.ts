import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { RestaurantService, MenuItem } from '../../../core/services/restaurant.service';
import { Subscription } from 'rxjs';

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
    BreadcrumbComponent
  ]
})
export class MenuComponent implements OnInit, OnDestroy {
  menuItems: MenuItem[] = [];
  filteredItems: MenuItem[] = [];
  categories: string[] = ['Starters', 'Main Course', 'Beverages', 'Desserts'];
  selectedCategory: string = 'All';
  private subscriptions = new Subscription();

  constructor(private restaurantService: RestaurantService) { }

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
    // Optimistic UI update or we can just let the service handle it
    const updatedItem = { ...item, isActive: event.checked };
    this.restaurantService.updateMenuItem(updatedItem);
  }
}
