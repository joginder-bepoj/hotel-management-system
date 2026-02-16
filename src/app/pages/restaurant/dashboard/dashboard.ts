import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { RestaurantService } from '../../../core/services/restaurant.service';

@Component({
    selector: 'app-restaurant-dashboard',
    templateUrl: './dashboard.html',
    styleUrls: ['./dashboard.scss'],
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        RouterModule,
        BreadcrumbComponent
    ]
})
export class RestaurantDashboardComponent implements OnInit {
    todaysSales: number = 0;
    totalOrders: number = 0;
    roomServiceOrders: number = 0;
    dineInOrders: number = 0;
    pendingOrders: number = 0;

    constructor(
        private restaurantService: RestaurantService,
        private router: Router
    ) { }

    ngOnInit() {
        this.loadStatistics();
    }

    loadStatistics() {
        this.todaysSales = this.restaurantService.getTodaysSales();
        this.totalOrders = this.restaurantService.getTodaysOrderCount();
        this.roomServiceOrders = this.restaurantService.getRoomServiceCount();
        this.dineInOrders = this.restaurantService.getDineInCount();
        this.pendingOrders = this.restaurantService.getPendingKitchenOrders();
    }

    navigateToNewOrder() {
        this.router.navigate(['/restaurant/new-order']);
    }

    navigateToKitchen() {
        this.router.navigate(['/restaurant/kitchen']);
    }

    navigateToTables() {
        this.router.navigate(['/restaurant/tables']);
    }
}
