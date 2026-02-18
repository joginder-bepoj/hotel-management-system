import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { RestaurantService, MenuItem, Order, OrderItem, Table } from '../../../core/services/restaurant.service';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.html',
  styleUrls: ['./new-order.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatTabsModule,
    MatBadgeModule,
    MatSnackBarModule,
    BreadcrumbComponent
  ]
})
export class NewOrderComponent implements OnInit {
  menuItems: MenuItem[] = [];
  categories: string[] = ['Starters', 'Main Course', 'Beverages', 'Desserts'];
  
  // Order State
  cart: OrderItem[] = [];
  orderType: 'Dine-in' | 'Room Service' = 'Dine-in';
  
  // Selection State
  tables: Table[] = [];
  selectedTableNumber: string = '';
  roomNumber: string = '';
  
  // UI State
  selectedCategory: string = 'All';
  searchQuery: string = '';

  constructor(
    private restaurantService: RestaurantService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.menuItems = this.restaurantService.getActiveMenuItems();
    this.tables = this.restaurantService.getAvailableTables();
    
    this.route.queryParams.subscribe(params => {
      if (params['tableId']) {
        const table = this.tables.find(t => t.id === Number(params['tableId']));
        if (table) {
          this.orderType = 'Dine-in';
          this.selectedTableNumber = table.tableNumber;
        }
      }
    });
  }

  get filteredItems() {
    return this.menuItems.filter(item => {
      const matchCategory = this.selectedCategory === 'All' || item.category === this.selectedCategory;
      const matchSearch = item.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }

  addToCart(item: MenuItem) {
    const existingItem = this.cart.find(i => i.menuItem.id === item.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cart.push({ menuItem: item, quantity: 1 });
    }
  }

  removeFromCart(index: number) {
    this.cart.splice(index, 1);
  }

  updateQuantity(index: number, change: number) {
    if (this.cart[index].quantity + change > 0) {
      this.cart[index].quantity += change;
    } else {
      this.removeFromCart(index);
    }
  }

  get subtotal() {
    return this.cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
  }

  get tax() {
    return this.subtotal * 0.18; // 18% Tax
  }

  get total() {
    return this.subtotal + this.tax;
  }

  placeOrder() {
    if (this.cart.length === 0) {
      this.showNotification('Cart is empty', 'error');
      return;
    }

    if (this.orderType === 'Dine-in' && !this.selectedTableNumber) {
      this.showNotification('Please select a table', 'error');
      return;
    }

    if (this.orderType === 'Room Service' && !this.roomNumber) {
      this.showNotification('Please enter room number', 'error');
      return;
    }

    const orderData = {
      type: this.orderType,
      tableNumber: this.selectedTableNumber || undefined,
      roomNumber: this.roomNumber || undefined,
      items: [...this.cart],
      subtotal: this.subtotal,
      tax: this.tax,
      total: this.total,
      status: 'Pending' as const,
      isPaid: false
    };
    
    this.restaurantService.createOrder(orderData);
    this.showNotification('Order placed successfully!', 'success');
    this.router.navigate(['/restaurant/kitchen']);
  }

  showNotification(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: type === 'success' ? 'snackbar-success' : 'snackbar-error'
    });
  }
}
