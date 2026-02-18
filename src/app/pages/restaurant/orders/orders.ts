import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { RestaurantService, Order } from '../../../core/services/restaurant.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.html',
  styleUrls: ['./orders.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatTableModule, 
    MatSortModule, 
    MatPaginatorModule,
    MatChipsModule,
    BreadcrumbComponent
  ]
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  displayedColumns: string[] = ['orderNumber', 'type', 'location', 'items', 'total', 'status', 'payment'];

  constructor(private restaurantService: RestaurantService) {}

  ngOnInit() {
    this.orders = this.restaurantService.getOrders();
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'Pending': return 'bg-orange';
      case 'Preparing': return 'bg-blue';
      case 'Ready': return 'bg-cyan';
      case 'Served': return 'bg-green';
      case 'Cancelled': return 'bg-red';
      default: return '';
    }
  }

  getPaymentStatusClass(isPaid: boolean): string {
    return isPaid ? 'bg-green' : 'bg-red';
  }
}
