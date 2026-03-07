import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { RestaurantService, Order } from '../../../core/services/restaurant.service';
import { Subscription } from 'rxjs';

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
export class OrdersComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  displayedColumns: string[] = ['orderNumber', 'type', 'location', 'items', 'total', 'status', 'payment'];
  private subscriptions = new Subscription();

  constructor(private restaurantService: RestaurantService) { }

  ngOnInit() {
    this.subscriptions.add(
      this.restaurantService.orders$.subscribe(orders => {
        // Sorting by newest first
        this.orders = [...orders].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  getStatusClass(status: string): string {
    switch (status) {
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
