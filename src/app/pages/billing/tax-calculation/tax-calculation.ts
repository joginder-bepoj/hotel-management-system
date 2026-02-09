import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';

interface TaxRule {
    id: number;
    name: string;
    rate: number;
    type: 'Percentage' | 'Fixed';
    category: 'Room' | 'F&B' | 'Service' | 'Others';
    isActive: boolean;
}

interface TaxHistory {
    id: string;
    invoiceId: string;
    totalAmount: number;
    taxAmount: number;
    date: Date;
}

@Component({
    selector: 'app-tax-calculation',
    templateUrl: './tax-calculation.html',
    styleUrls: ['./tax-calculation.scss'],
    standalone: true,
    imports: [
        CommonModule,
        BreadcrumbComponent,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatSlideToggleModule,
        FormsModule
    ]
})
export class TaxCalculationComponent implements OnInit {
    taxRules: TaxRule[] = [
        { id: 1, name: 'GST - Room (Luxury)', rate: 18, type: 'Percentage', category: 'Room', isActive: true },
        { id: 2, name: 'GST - F&B', rate: 5, type: 'Percentage', category: 'F&B', isActive: true },
        { id: 3, name: 'Service Charge', rate: 10, type: 'Percentage', category: 'Service', isActive: true },
        { id: 4, name: 'Tourism Tax', rate: 100, type: 'Fixed', category: 'Others', isActive: false }
    ];

    taxHistory: TaxHistory[] = [
        { id: 'TX-5001', invoiceId: 'INV-1001', totalAmount: 15400, taxAmount: 2772, date: new Date() },
        { id: 'TX-5002', invoiceId: 'INV-1002', totalAmount: 8200, taxAmount: 410, date: new Date(Date.now() - 86400000) },
        { id: 'TX-5003', invoiceId: 'INV-1003', totalAmount: 12500, taxAmount: 2250, date: new Date(Date.now() - 172800000) }
    ];

    displayedColumns: string[] = ['name', 'rate', 'type', 'category', 'status', 'actions'];
    historyColumns: string[] = ['txId', 'invId', 'total', 'tax', 'date'];

    constructor() { }

    ngOnInit(): void {
    }

    toggleRule(rule: TaxRule): void {
        rule.isActive = !rule.isActive;
        // In a real app, this would call a service to update the backend
    }

    editRule(rule: TaxRule): void {
        console.log('Editing tax rule:', rule);
    }

    addTaxRule(): void {
        console.log('Adding new tax rule');
    }

    getTotalTaxCollected(): number {
        return this.taxHistory.reduce((acc, curr) => acc + curr.taxAmount, 0);
    }
}
