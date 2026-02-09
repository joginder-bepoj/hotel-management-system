import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface StorageLocation {
    id: number;
    name: string;
    capacity: number;
    currentStock: number;
    itemCount: number;
    type: string;
}

@Component({
    selector: 'app-store-warehouse',
    templateUrl: './store-warehouse.html',
    styleUrls: ['./store-warehouse.scss'],
    standalone: true,
    imports: [CommonModule, BreadcrumbComponent, MatCardModule, MatIconModule, MatButtonModule]
})
export class StoreWarehouseComponent implements OnInit {
    locations: StorageLocation[] = [
        { id: 1, name: 'Main Store', capacity: 1000, currentStock: 750, itemCount: 125, type: 'General' },
        { id: 2, name: 'Kitchen Store', capacity: 500, currentStock: 380, itemCount: 68, type: 'Food & Beverage' },
        { id: 3, name: 'Linen Room', capacity: 800, currentStock: 620, itemCount: 95, type: 'Linen' },
        { id: 4, name: 'Housekeeping Store', capacity: 600, currentStock: 420, itemCount: 72, type: 'Housekeeping' },
    ];

    constructor() { }

    ngOnInit(): void { }

    getCapacityPercentage(location: StorageLocation): number {
        return Math.round((location.currentStock / location.capacity) * 100);
    }
}
