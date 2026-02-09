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
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';

interface Transaction {
    id: number;
    date: Date;
    description: string;
    category: 'Room' | 'F&B' | 'Laundry' | 'Spa' | 'Others';
    amount: number;
    type: 'Debit' | 'Credit';
}

interface Folio {
    folioId: string;
    bookingId: string;
    guestName: string;
    roomNo: string;
    checkIn: Date;
    checkOut: Date;
    status: 'Active' | 'Closed';
    transactions: Transaction[];
}

@Component({
    selector: 'app-folio-management',
    templateUrl: './folio-management.html',
    styleUrls: ['./folio-management.scss'],
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
        MatChipsModule,
        FormsModule
    ]
})
export class FolioManagementComponent implements OnInit {
    searchQuery: string = '';
    selectedFolio: Folio | null = null;
    displayedColumns: string[] = ['date', 'description', 'category', 'amount', 'type', 'actions'];

    folios: Folio[] = [
        {
            folioId: 'FOL-2024-001',
            bookingId: 'BK-1001',
            guestName: 'John Doe',
            roomNo: '101',
            checkIn: new Date('2024-02-08'),
            checkOut: new Date('2024-02-12'),
            status: 'Active',
            transactions: [
                { id: 1, date: new Date('2024-02-08'), description: 'Room Charge - Night 1', category: 'Room', amount: 5000, type: 'Debit' },
                { id: 2, date: new Date('2024-02-09'), description: 'Room Charge - Night 2', category: 'Room', amount: 5000, type: 'Debit' },
                { id: 3, date: new Date('2024-02-09'), description: 'Breakfast Buffet', category: 'F&B', amount: 1200, type: 'Debit' },
                { id: 4, date: new Date('2024-02-10'), description: 'Laundry Services', category: 'Laundry', amount: 800, type: 'Debit' },
                { id: 5, date: new Date('2024-02-10'), description: 'Advance Payment', category: 'Others', amount: 5000, type: 'Credit' }
            ]
        },
        {
            folioId: 'FOL-2024-002',
            bookingId: 'BK-1002',
            guestName: 'Jane Smith',
            roomNo: '205',
            checkIn: new Date('2024-02-09'),
            checkOut: new Date('2024-02-11'),
            status: 'Active',
            transactions: [
                { id: 1, date: new Date('2024-02-09'), description: 'Room Charge - Night 1', category: 'Room', amount: 7500, type: 'Debit' },
                { id: 2, date: new Date('2024-02-10'), description: 'Mini Bar', category: 'F&B', amount: 450, type: 'Debit' }
            ]
        }
    ];

    filteredFolios: Folio[] = [];

    constructor() { }

    ngOnInit(): void {
        this.filteredFolios = [...this.folios];
        if (this.folios.length > 0) {
            this.selectedFolio = this.folios[0];
        }
    }

    applyFilter(): void {
        const query = this.searchQuery.toLowerCase();
        this.filteredFolios = this.folios.filter(f =>
            f.guestName.toLowerCase().includes(query) ||
            f.roomNo.includes(query) ||
            f.folioId.toLowerCase().includes(query)
        );
    }

    selectFolio(folio: Folio): void {
        this.selectedFolio = folio;
    }

    getTotalDebit(): number {
        if (!this.selectedFolio) return 0;
        return this.selectedFolio.transactions
            .filter(t => t.type === 'Debit')
            .reduce((acc, t) => acc + t.amount, 0);
    }

    getTotalCredit(): number {
        if (!this.selectedFolio) return 0;
        return this.selectedFolio.transactions
            .filter(t => t.type === 'Credit')
            .reduce((acc, t) => acc + t.amount, 0);
    }

    getBalance(): number {
        return this.getTotalDebit() - this.getTotalCredit();
    }

    addCharge(): void {
        // Implementation for adding a charge (would typically open a dialog)
        console.log('Opening Add Charge Dialog');
    }

    deleteTransaction(transactionId: number): void {
        if (!this.selectedFolio) return;
        this.selectedFolio.transactions = this.selectedFolio.transactions.filter(t => t.id !== transactionId);
        // In a real app, this would call a service
    }
}
