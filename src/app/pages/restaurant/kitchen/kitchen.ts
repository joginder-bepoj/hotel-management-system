import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { RestaurantService, Order } from '../../../core/services/restaurant.service';
import { Subscription } from 'rxjs';

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
export class KitchenComponent implements OnInit, OnDestroy {
  pendingOrders: Order[] = [];
  preparingOrders: Order[] = [];
  private subscriptions = new Subscription();

  constructor(private restaurantService: RestaurantService) { }

  ngOnInit() {
    this.subscriptions.add(
      this.restaurantService.orders$.subscribe(orders => {
        this.pendingOrders = orders.filter(o => o.status === 'Pending').sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        this.preparingOrders = orders.filter(o => o.status === 'Preparing').sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  updateStatus(order: Order, status: Order['status']) {
    this.restaurantService.updateOrderStatus(order.id, status);
  }

  getTimeElapsed(date: Date): string {
    const diff = Math.floor((new Date().getTime() - new Date(date).getTime()) / 60000); // minutes
    return `${diff} min ago`;
  }
}
