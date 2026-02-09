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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';

interface Payment {
    id: string;
    guestName: string;
    bookingId: string;
    amount: number;
    method: 'Cash' | 'Card' | 'UPI' | 'Wallet';
    date: Date;
    status: 'Success' | 'Failed' | 'Pending';
}

@Component({
    selector: 'app-payment-collection',
    templateUrl: './payment-collection.html',
    styleUrls: ['./payment-collection.scss'],
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
        MatSnackBarModule,
        FormsModule
    ]
})
export class PaymentCollectionComponent implements OnInit {
    recentPayments: Payment[] = [
        { id: 'PAY-2001', guestName: 'Alice Green', bookingId: 'BK-1001', amount: 5000, method: 'UPI', date: new Date(), status: 'Success' },
        { id: 'PAY-2002', guestName: 'Robert White', bookingId: 'BK-1002', amount: 8200, method: 'Card', date: new Date(Date.now() - 3600000), status: 'Success' },
        { id: 'PAY-2003', guestName: 'Charlie Brown', bookingId: 'BK-1003', amount: 3000, method: 'Cash', date: new Date(Date.now() - 86400000), status: 'Success' }
    ];

    pendingCollections = [
        { guestName: 'John Doe', roomNo: '101', pendingAmount: 6200, folioId: 'FOL-001' },
        { guestName: 'Jane Smith', roomNo: '205', pendingAmount: 7950, folioId: 'FOL-002' },
        { guestName: 'Mike Ross', roomNo: '302', pendingAmount: 4500, folioId: 'FOL-003' }
    ];

    displayedColumns: string[] = ['id', 'guestName', 'amount', 'method', 'status', 'date'];
    
    // Form fields
    selectedGuest: any = null;
    paymentAmount: number = 0;
    paymentMethod: string = 'Card';

    constructor(private snackBar: MatSnackBar) { }

    ngOnInit(): void {
    }

    collectPayment(guest: any): void {
        this.selectedGuest = guest;
        this.paymentAmount = guest.pendingAmount;
    }

    processPayment(): void {
        if (!this.selectedGuest || this.paymentAmount <= 0) return;

        const newPayment: Payment = {
            id: `PAY-${Math.floor(Math.random() * 9000) + 1000}`,
            guestName: this.selectedGuest.guestName,
            bookingId: 'BK-XXXX', // In real app, this would be linked
            amount: this.paymentAmount,
            method: this.paymentMethod as any,
            date: new Date(),
            status: 'Success'
        };

        this.recentPayments = [newPayment, ...this.recentPayments];
        
        // Remove from pending
        this.pendingCollections = this.pendingCollections.filter(p => p.guestName !== this.selectedGuest.guestName);
        
        this.snackBar.open(`Payment of ₹${this.paymentAmount} processed successfully for ${this.selectedGuest.guestName}`, 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
        });

        this.selectedGuest = null;
        this.paymentAmount = 0;
    }

    cancelCollection(): void {
        this.selectedGuest = null;
        this.paymentAmount = 0;
    }
}
