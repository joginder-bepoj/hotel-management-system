import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-consumption-tracking',
    templateUrl: './consumption-tracking.html',
    styleUrls: ['./consumption-tracking.scss'],
    standalone: true,
    imports: [CommonModule, BreadcrumbComponent, MatCardModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, FormsModule]
})
export class ConsumptionTrackingComponent implements OnInit {
    startDate: Date = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    endDate: Date = new Date();

    consumptionData = [
        { department: 'Housekeeping', items: 45, totalValue: 12500, trend: 'up' },
        { department: 'Kitchen', items: 38, totalValue: 18000, trend: 'down' },
        { department: 'Front Office', items: 22, totalValue: 8500, trend: 'stable' },
        { department: 'Maintenance', items: 15, totalValue: 6200, trend: 'up' },
    ];

    topItems = [
        { name: 'Cleaning Solution', quantity: 45, unit: 'liters' },
        { name: 'Coffee Beans', quantity: 38, unit: 'kg' },
        { name: 'Towels', quantity: 120, unit: 'pieces' },
        { name: 'Light Bulbs', quantity: 85, unit: 'pieces' },
    ];

    constructor() { }

    ngOnInit(): void { }
}
