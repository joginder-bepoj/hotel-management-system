import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { RestaurantService, Order } from '../../../core/services/restaurant.service';

@Component({
  selector: 'app-kitchen',
  templateUrl: './kitchen.html',
  styleUrls: ['./kitchen.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    BreadcrumbComponent
  ]
})
export class KitchenComponent implements OnInit {
  pendingOrders: Order[] = [];
  preparingOrders: Order[] = [];

  constructor(private restaurantService: RestaurantService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.pendingOrders = this.restaurantService.getOrdersByStatus('Pending');
    this.preparingOrders = this.restaurantService.getOrdersByStatus('Preparing');
  }

  updateStatus(order: Order, status: Order['status']) {
    this.restaurantService.updateOrderStatus(order.id, status);
    this.loadOrders();
  }

  getTimeElapsed(date: Date): string {
    const diff = Math.floor((new Date().getTime() - new Date(date).getTime()) / 60000); // minutes
    return `${diff} min ago`;
  }
}
