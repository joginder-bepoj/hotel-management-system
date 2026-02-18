import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { RestaurantService, Order } from '../../../core/services/restaurant.service';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.html',
  styleUrls: ['./bills.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatMenuModule,
    MatTabsModule,
    BreadcrumbComponent
  ]
})
export class BillsComponent implements OnInit {
  activeOrders: Order[] = [];
  paidOrders: Order[] = [];
  selectedOrder: Order | null = null;
  displayedColumns: string[] = ['billNo', 'orderNo', 'type', 'total', 'paymentMode'];

  constructor(
    private restaurantService: RestaurantService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadOrders();
    this.route.queryParams.subscribe(params => {
      if (params['orderId']) {
        this.selectOrderById(Number(params['orderId']));
      }
    });
  }

  loadOrders() {
    const allOrders = this.restaurantService.getOrders();
    this.activeOrders = allOrders.filter(o => !o.isPaid);
    this.paidOrders = allOrders.filter(o => o.isPaid);
    
    // Refresh selected order if it exists
    if (this.selectedOrder) {
      this.selectedOrder = this.restaurantService.getOrderById(this.selectedOrder.id) || null;
    }
  }

  selectOrderById(id: number) {
    const order = this.restaurantService.getOrderById(id);
    if (order) {
      this.selectedOrder = order;
    }
  }

  selectOrder(order: Order) {
    this.selectedOrder = order;
  }

  processPayment(order: Order) {
    // In a real app, this would open a dialog for payment mode
    if (confirm(`Process payment of ₹${order.total} for Order #${order.orderNumber}?`)) {
      this.restaurantService.markOrderPaid(order.id, 'Cash', false);
      this.loadOrders();
      this.selectedOrder = null;
    }
  }

  postToRoom(order: Order) {
    if (order.type !== 'Room Service' || !order.roomNumber) return;
    
    if (confirm(`Post charges of ₹${order.total} to Room ${order.roomNumber}?`)) {
      this.restaurantService.markOrderPaid(order.id, 'Room Posting', true);
      this.loadOrders();
      this.selectedOrder = null;
    }
  }

  printBill(order: Order) {
    window.print();
  }
}
