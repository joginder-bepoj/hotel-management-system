import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { RestaurantService, Table, Order } from '../../../core/services/restaurant.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.html',
  styleUrls: ['./tables.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    RouterModule,
    BreadcrumbComponent
  ]
})
export class TablesComponent implements OnInit, OnDestroy {
  tables: Table[] = [];
  private subscriptions = new Subscription();

  constructor(
    private restaurantService: RestaurantService,
    private router: Router
  ) { }

  ngOnInit() {
    this.subscriptions.add(
      this.restaurantService.tables$.subscribe(tables => {
        this.tables = tables;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Available': return 'success';
      case 'Occupied': return 'danger';
      case 'Reserved': return 'warning';
      default: return 'primary';
    }
  }

  onNewOrder(table: Table) {
    if (table.status === 'Available') {
      // Navigate to new order page with table param
      this.router.navigate(['/restaurant/new-order'], { queryParams: { tableId: table.id } });
    }
  }

  onViewOrder(table: Table) {
    if (table.activeOrderId) {
      // Navigate to bills or orders detail
      this.router.navigate(['/restaurant/bills'], { queryParams: { orderId: table.activeOrderId } });
    }
  }
}
