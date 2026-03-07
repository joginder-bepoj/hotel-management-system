import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { Subscription } from 'rxjs';

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
export class BillsComponent implements OnInit, OnDestroy {
  activeOrders: Order[] = [];
  paidOrders: Order[] = [];
  selectedOrder: Order | null = null;
  displayedColumns: string[] = ['billNo', 'orderNo', 'type', 'total', 'paymentMode'];
  private subscriptions = new Subscription();

  constructor(
    private restaurantService: RestaurantService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.subscriptions.add(
      this.restaurantService.orders$.subscribe(orders => {
        this.activeOrders = orders.filter(o => !o.isPaid).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        this.paidOrders = orders.filter(o => o.isPaid).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        // Refresh selected order if it exists
        if (this.selectedOrder) {
          this.selectedOrder = orders.find(o => o.id === this.selectedOrder!.id) || null;
        }
      })
    );

    this.route.queryParams.subscribe(params => {
      if (params['orderId']) {
        const orderId = Number(params['orderId']);
        this.selectOrderById(orderId);
      }
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  selectOrderById(id: number) {
    const orders = this.restaurantService.getOrders();
    const order = orders.find(o => o.id === id);
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
        this.selectedOrder = null;
        Swal.fire('Posted!', 'Charges have been posted to the room.', 'success');
      }
    });
  }

  printBill(order: Order) {
    window.print();
  }
}
