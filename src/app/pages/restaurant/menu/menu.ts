import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { RestaurantService, MenuItem } from '../../../core/services/restaurant.service';

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
export class MenuComponent implements OnInit {
  menuItems: MenuItem[] = [];
  filteredItems: MenuItem[] = [];
  categories: string[] = ['Starters', 'Main Course', 'Beverages', 'Desserts'];
  selectedCategory: string = 'All';

  constructor(private restaurantService: RestaurantService) {}

  ngOnInit() {
    this.menuItems = this.restaurantService.getMenuItems();
    this.filteredItems = [...this.menuItems];
    
    // Extract unique categories dynamically if needed, or use predefined
    // const uniqueCats = [...new Set(this.menuItems.map(item => item.category))]; 
  }

  filterCategory(category: string) {
    this.selectedCategory = category;
    if (category === 'All') {
      this.filteredItems = [...this.menuItems];
    } else {
      this.filteredItems = this.menuItems.filter(item => item.category === category);
    }
  }
}
