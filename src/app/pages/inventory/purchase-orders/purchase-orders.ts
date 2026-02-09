import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

interface PurchaseOrder {
    id: string;
    supplier: string;
    items: number;
    totalAmount: number;
    status: 'draft' | 'pending' | 'approved' | 'received';
    orderDate: Date;
    expectedDelivery: Date;
}

@Component({
    selector: 'app-purchase-orders',
    templateUrl: './purchase-orders.html',
    styleUrls: ['./purchase-orders.scss'],
    standalone: true,
    imports: [CommonModule, BreadcrumbComponent, MatCardModule, MatIconModule, MatButtonModule, MatChipsModule]
})
export class PurchaseOrdersComponent implements OnInit {
    selectedStatus: string = 'all';

    orders: PurchaseOrder[] = [
        { id: 'PO-001', supplier: 'ABC Supplies', items: 15, totalAmount: 25000, status: 'pending', orderDate: new Date('2026-02-07'), expectedDelivery: new Date('2026-02-12') },
        { id: 'PO-002', supplier: 'XYZ Traders', items: 8, totalAmount: 18500, status: 'approved', orderDate: new Date('2026-02-08'), expectedDelivery: new Date('2026-02-14') },
        { id: 'PO-003', supplier: 'Best Linens', items: 20, totalAmount: 32000, status: 'received', orderDate: new Date('2026-02-05'), expectedDelivery: new Date('2026-02-10') },
        { id: 'PO-004', supplier: 'Fresh Foods Co', items: 12, totalAmount: 15000, status: 'draft', orderDate: new Date('2026-02-09'), expectedDelivery: new Date('2026-02-15') },
    ];

    filteredOrders: PurchaseOrder[] = [];

    constructor() { }

    ngOnInit(): void {
        this.applyFilter('all');
    }

    applyFilter(status: string): void {
        this.selectedStatus = status;
        this.filteredOrders = status === 'all' ? [...this.orders] : this.orders.filter(o => o.status === status);
    }

    getStatusCount(status: string): number {
        return status === 'all' ? this.orders.length : this.orders.filter(o => o.status === status).length;
    }
}
