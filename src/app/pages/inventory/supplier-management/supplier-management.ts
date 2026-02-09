import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface Supplier {
    id: number;
    name: string;
    contact: string;
    email: string;
    categories: string[];
    rating: number;
    totalOrders: number;
}

@Component({
    selector: 'app-supplier-management',
    templateUrl: './supplier-management.html',
    styleUrls: ['./supplier-management.scss'],
    standalone: true,
    imports: [CommonModule, BreadcrumbComponent, MatCardModule, MatIconModule, MatButtonModule]
})
export class SupplierManagementComponent implements OnInit {
    suppliers: Supplier[] = [
        { id: 1, name: 'ABC Supplies', contact: '+91 98765 43210', email: 'contact@abcsupplies.com', categories: ['Toiletries', 'Housekeeping'], rating: 4.5, totalOrders: 45 },
        { id: 2, name: 'XYZ Traders', contact: '+91 98765 43211', email: 'info@xyztraders.com', categories: ['Food & Beverage'], rating: 4.8, totalOrders: 62 },
        { id: 3, name: 'Best Linens', contact: '+91 98765 43212', email: 'sales@bestlinens.com', categories: ['Linen'], rating: 4.2, totalOrders: 38 },
        { id: 4, name: 'Fresh Foods Co', contact: '+91 98765 43213', email: 'orders@freshfoods.com', categories: ['Food & Beverage'], rating: 4.6, totalOrders: 51 },
    ];

    constructor() { }

    ngOnInit(): void { }

    getStars(rating: number): number[] {
        return Array(Math.floor(rating)).fill(0);
    }
}
