import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';

interface AlertItem {
    id: number;
    name: string;
    category: string;
    currentStock: number;
    minStock: number;
    unit: string;
    priority: 'critical' | 'warning' | 'normal';
    daysUntilEmpty: number;
}

@Component({
    selector: 'app-low-stock-alerts',
    templateUrl: './low-stock-alerts.html',
    styleUrls: ['./low-stock-alerts.scss'],
    standalone: true,
    imports: [
        CommonModule,
        BreadcrumbComponent,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatChipsModule
    ]
})
export class LowStockAlertsComponent implements OnInit {
    selectedPriority: string = 'all';

    alerts: AlertItem[] = [
        { id: 1, name: 'Hand Soap', category: 'Toiletries', currentStock: 5, minStock: 30, unit: 'bottles', priority: 'critical', daysUntilEmpty: 2 },
        { id: 2, name: 'Bath Towels', category: 'Linen', currentStock: 45, minStock: 50, unit: 'pieces', priority: 'warning', daysUntilEmpty: 7 },
        { id: 3, name: 'Coffee Beans', category: 'Food & Beverage', currentStock: 25, minStock: 30, unit: 'kg', priority: 'warning', daysUntilEmpty: 5 },
        { id: 4, name: 'Toilet Paper', category: 'Toiletries', currentStock: 10, minStock: 50, unit: 'rolls', priority: 'critical', daysUntilEmpty: 3 },
        { id: 5, name: 'Dish Soap', category: 'Housekeeping', currentStock: 15, minStock: 25, unit: 'bottles', priority: 'normal', daysUntilEmpty: 10 },
    ];

    filteredAlerts: AlertItem[] = [];

    constructor(private snackBar: MatSnackBar) { }

    ngOnInit(): void {
        this.applyFilter('all');
    }

    applyFilter(priority: string): void {
        this.selectedPriority = priority;
        if (priority === 'all') {
            this.filteredAlerts = [...this.alerts];
        } else {
            this.filteredAlerts = this.alerts.filter(alert => alert.priority === priority);
        }
    }

    getAlertCount(priority: string): number {
        if (priority === 'all') return this.alerts.length;
        return this.alerts.filter(alert => alert.priority === priority).length;
    }

    reorderItem(alert: AlertItem): void {
        this.snackBar.open(`Reorder initiated for ${alert.name}`, 'Close', {
            duration: 3000,
            verticalPosition: 'bottom',
            horizontalPosition: 'center'
        });
    }

    dismissAlert(alert: AlertItem): void {
        const index = this.alerts.findIndex(a => a.id === alert.id);
        if (index !== -1) {
            this.alerts.splice(index, 1);
            this.applyFilter(this.selectedPriority);
            this.snackBar.open(`Alert dismissed for ${alert.name}`, 'Close', {
                duration: 3000
            });
        }
    }
}
