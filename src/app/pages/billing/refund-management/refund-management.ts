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

interface Refund {
    id: string;
    originalPaymentId: string;
    guestName: string;
    amount: number;
    reason: string;
    date: Date;
    status: 'Processed' | 'Pending' | 'Rejected';
}

@Component({
    selector: 'app-refund-management',
    templateUrl: './refund-management.html',
    styleUrls: ['./refund-management.scss'],
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
export class RefundManagementComponent implements OnInit {
    refunds: Refund[] = [
        { id: 'REF-3001', originalPaymentId: 'PAY-2005', guestName: 'John Doe', amount: 1500, reason: 'Duplicate charge', date: new Date(), status: 'Processed' },
        { id: 'REF-3002', originalPaymentId: 'PAY-2008', guestName: 'Jane Smith', amount: 3000, reason: 'Room cancellation', date: new Date(Date.now() - 86400000), status: 'Pending' }
    ];

    refundablePayments = [
        { id: 'PAY-2010', guestName: 'Mike Ross', amount: 4500, date: new Date(Date.now() - 172800000) },
        { id: 'PAY-2011', guestName: 'Rachel Zane', amount: 1200, date: new Date(Date.now() - 259200000) }
    ];

    displayedColumns: string[] = ['id', 'guestName', 'amount', 'reason', 'status', 'date'];
    
    // Form fields
    selectedPayment: any = null;
    refundAmount: number = 0;
    refundReason: string = '';

    constructor(private snackBar: MatSnackBar) { }

    ngOnInit(): void {
    }

    initiateRefund(payment: any): void {
        this.selectedPayment = payment;
        this.refundAmount = payment.amount;
    }

    processRefund(): void {
        if (!this.selectedPayment || this.refundAmount <= 0) return;

        const newRefund: Refund = {
            id: `REF-${Math.floor(Math.random() * 9000) + 3000}`,
            originalPaymentId: this.selectedPayment.id,
            guestName: this.selectedPayment.guestName,
            amount: this.refundAmount,
            reason: this.refundReason || 'No reason provided',
            date: new Date(),
            status: 'Processed'
        };

        this.refunds = [newRefund, ...this.refunds];
        
        // In a real app, this would update the payment status as well
        this.refundablePayments = this.refundablePayments.filter(p => p.id !== this.selectedPayment.id);
        
        this.snackBar.open(`Refund of ₹${this.refundAmount} processed for ${this.selectedPayment.guestName}`, 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
        });

        this.selectedPayment = null;
        this.refundAmount = 0;
        this.refundReason = '';
    }

    cancelRefund(): void {
        this.selectedPayment = null;
        this.refundAmount = 0;
        this.refundReason = '';
    }
}
