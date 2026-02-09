import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';

interface StockItem {
    id: number;
    name: string;
    category: string;
    currentStock: number;
    minStock: number;
    maxStock: number;
    unit: string;
    location: string;
    lastUpdated: Date;
    status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

@Component({
    selector: 'app-stock-management',
    templateUrl: './stock-management.html',
    styleUrls: ['./stock-management.scss'],
    standalone: true,
    imports: [
        CommonModule,
        BreadcrumbComponent,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatChipsModule,
        MatFormFieldModule,
        MatInputModule,
        MatMenuModule,
        FormsModule
    ]
})
export class StockManagementComponent implements OnInit {
    searchQuery: string = '';
    selectedCategory: string = 'all';

    categories = ['All', 'Food & Beverage', 'Housekeeping', 'Toiletries', 'Linen', 'Maintenance'];

    stockItems: StockItem[] = [
        { id: 1, name: 'Shampoo Bottles', category: 'Toiletries', currentStock: 150, minStock: 50, maxStock: 300, unit: 'bottles', location: 'Main Store', lastUpdated: new Date('2026-02-08'), status: 'in-stock' },
        { id: 2, name: 'Bath Towels', category: 'Linen', currentStock: 45, minStock: 50, maxStock: 200, unit: 'pieces', location: 'Linen Room', lastUpdated: new Date('2026-02-09'), status: 'low-stock' },
        { id: 3, name: 'Coffee Beans', category: 'Food & Beverage', currentStock: 25, minStock: 30, maxStock: 100, unit: 'kg', location: 'Kitchen Store', lastUpdated: new Date('2026-02-07'), status: 'low-stock' },
        { id: 4, name: 'Cleaning Solution', category: 'Housekeeping', currentStock: 80, minStock: 40, maxStock: 150, unit: 'liters', location: 'Housekeeping Store', lastUpdated: new Date('2026-02-09'), status: 'in-stock' },
        { id: 5, name: 'Bed Sheets', category: 'Linen', currentStock: 120, minStock: 60, maxStock: 250, unit: 'pieces', location: 'Linen Room', lastUpdated: new Date('2026-02-08'), status: 'in-stock' },
        { id: 6, name: 'Hand Soap', category: 'Toiletries', currentStock: 5, minStock: 30, maxStock: 150, unit: 'bottles', location: 'Main Store', lastUpdated: new Date('2026-02-06'), status: 'out-of-stock' },
        { id: 7, name: 'Light Bulbs', category: 'Maintenance', currentStock: 90, minStock: 40, maxStock: 200, unit: 'pieces', location: 'Maintenance Store', lastUpdated: new Date('2026-02-09'), status: 'in-stock' },
        { id: 8, name: 'Tea Bags', category: 'Food & Beverage', currentStock: 200, minStock: 100, maxStock: 500, unit: 'boxes', location: 'Kitchen Store', lastUpdated: new Date('2026-02-08'), status: 'in-stock' },
    ];

    filteredItems: StockItem[] = [];

    constructor(private snackBar: MatSnackBar) { }

    ngOnInit(): void {
        this.updateStockStatus();
        this.applyFilters();
    }

    updateStockStatus(): void {
        this.stockItems.forEach(item => {
            if (item.currentStock <= 0) {
                item.status = 'out-of-stock';
            } else if (item.currentStock < item.minStock) {
                item.status = 'low-stock';
            } else {
                item.status = 'in-stock';
            }
        });
    }

    applyFilters(): void {
        let filtered = [...this.stockItems];

        // Category filter
        if (this.selectedCategory !== 'all') {
            filtered = filtered.filter(item => 
                item.category.toLowerCase() === this.selectedCategory.toLowerCase()
            );
        }

        // Search filter
        if (this.searchQuery.trim()) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(query) ||
                item.category.toLowerCase().includes(query) ||
                item.location.toLowerCase().includes(query)
            );
        }

        this.filteredItems = filtered;
    }

    selectCategory(category: string): void {
        this.selectedCategory = category.toLowerCase();
        this.applyFilters();
    }

    getStockPercentage(item: StockItem): number {
        return Math.round((item.currentStock / item.maxStock) * 100);
    }

    adjustStock(item: StockItem, adjustment: number): void {
        item.currentStock += adjustment;
        if (item.currentStock < 0) item.currentStock = 0;
        if (item.currentStock > item.maxStock) item.currentStock = item.maxStock;
        
        item.lastUpdated = new Date();
        this.updateStockStatus();
        this.applyFilters();

        const action = adjustment > 0 ? 'added to' : 'removed from';
        this.snackBar.open(`Stock ${action} ${item.name}`, 'Close', {
            duration: 3000,
            verticalPosition: 'bottom',
            horizontalPosition: 'center'
        });
    }

    getStatusCount(status: string): number {
        return this.stockItems.filter(item => item.status === status).length;
    }
}
