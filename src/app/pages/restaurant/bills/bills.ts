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
import Swal from 'sweetalert2';

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
    Swal.fire({
      title: 'Process Payment',
      text: `Process payment of ₹${order.total} for Order #${order.orderNumber}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirm Payment',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.restaurantService.markOrderPaid(order.id, 'Cash', false);
        this.loadOrders();
        this.selectedOrder = null;
        Swal.fire('Paid!', 'Order has been marked as paid.', 'success');
      }
    });
  }

  postToRoom(order: Order) {
    if (order.type !== 'Room Service' || !order.roomNumber) return;
    
    Swal.fire({
      title: 'Post to Room',
      text: `Post charges of ₹${order.total} to Room ${order.roomNumber}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirm Post',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.restaurantService.markOrderPaid(order.id, 'Room Posting', true);
        this.loadOrders();
        this.selectedOrder = null;
        Swal.fire('Posted!', 'Charges have been posted to the room.', 'success');
      }
    });
  }

  printBill(order: Order) {
    window.print();
  }
}
