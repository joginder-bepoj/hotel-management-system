import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';

interface Invoice {
    id: string;
    folioId: string;
    guestName: string;
    date: Date;
    dueDate: Date;
    totalAmount: number;
    status: 'Paid' | 'Unpaid' | 'Overdue' | 'Draft';
}

@Component({
    selector: 'app-invoice-management',
    templateUrl: './invoice-management.html',
    styleUrls: ['./invoice-management.scss'],
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
        MatChipsModule,
        FormsModule
    ]
})
export class InvoiceManagementComponent implements OnInit {
    searchQuery: string = '';
    selectedStatus: string = 'All';
    displayedColumns: string[] = ['id', 'guestName', 'date', 'amount', 'status', 'actions'];

    invoices: Invoice[] = [
        { id: 'INV-1001', folioId: 'FOL-001', guestName: 'Alice Green', date: new Date('2024-02-05'), dueDate: new Date('2024-02-12'), totalAmount: 15400, status: 'Paid' },
        { id: 'INV-1002', folioId: 'FOL-002', guestName: 'Robert White', date: new Date('2024-02-06'), dueDate: new Date('2024-02-13'), totalAmount: 8200, status: 'Unpaid' },
        { id: 'INV-1003', folioId: 'FOL-003', guestName: 'Charlie Brown', date: new Date('2024-01-28'), dueDate: new Date('2024-02-04'), totalAmount: 12500, status: 'Overdue' },
        { id: 'INV-1004', folioId: 'FOL-004', guestName: 'Diana Prince', date: new Date('2024-02-08'), dueDate: new Date('2024-02-15'), totalAmount: 4500, status: 'Draft' },
        { id: 'INV-1005', folioId: 'FOL-005', guestName: 'Edward Norton', date: new Date('2024-02-09'), dueDate: new Date('2024-02-16'), totalAmount: 22000, status: 'Unpaid' }
    ];

    filteredInvoices: Invoice[] = [];

    constructor() { }

    ngOnInit(): void {
        this.applyFilter();
    }

    applyFilter(): void {
        this.filteredInvoices = this.invoices.filter(inv => {
            const matchesSearch = inv.guestName.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
                                 inv.id.toLowerCase().includes(this.searchQuery.toLowerCase());
            const matchesStatus = this.selectedStatus === 'All' || inv.status === this.selectedStatus;
            return matchesSearch && matchesStatus;
        });
    }

    setStatusFilter(status: string): void {
        this.selectedStatus = status;
        this.applyFilter();
    }

    getInvoicesByStatus(status: string): number {
        if (status === 'All') return this.invoices.length;
        return this.invoices.filter(inv => inv.status === status).length;
    }

    viewInvoice(id: string): void {
        console.log('Viewing invoice:', id);
    }

    downloadInvoice(id: string): void {
        console.log('Downloading invoice:', id);
    }
}
