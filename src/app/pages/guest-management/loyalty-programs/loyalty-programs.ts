import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

interface LoyaltyTier {
    name: string;
    minPoints: number;
    color: string;
    benefits: string[];
}

interface PointTransaction {
    id: string;
    date: Date;
    description: string;
    points: number;
    type: 'Earned' | 'Redeemed';
}

interface GuestLoyalty {
    id: string;
    name: string;
    points: number;
    currentTier: string;
    transactions: PointTransaction[];
}

@Component({
    selector: 'app-loyalty-programs',
    templateUrl: './loyalty-programs.html',
    styleUrls: ['./loyalty-programs.scss'],
    standalone: true,
    imports: [
        CommonModule,
        BreadcrumbComponent,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatProgressBarModule,
        MatTableModule,
        MatTabsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        FormsModule
    ]
})
export class LoyaltyProgramsComponent implements OnInit {
    guests: GuestLoyalty[] = [
        {
            id: 'GST-1001',
            name: 'Alice Green',
            points: 12500,
            currentTier: 'Platinum',
            transactions: [
                { id: 'TX-9001', date: new Date('2024-02-05'), description: 'Stay at Luxury Suite', points: 2500, type: 'Earned' },
                { id: 'TX-8050', date: new Date('2024-01-15'), description: 'Spa Treatment', points: 500, type: 'Earned' },
                { id: 'TX-7020', date: new Date('2023-12-25'), description: 'Redeemed for Free Night', points: -5000, type: 'Redeemed' },
                { id: 'TX-6005', date: new Date('2023-11-10'), description: 'Restaurant Bill', points: 350, type: 'Earned' }
            ]
        },
        {
            id: 'GST-1002',
            name: 'Robert White',
            points: 6200,
            currentTier: 'Gold',
            transactions: [
                { id: 'TX-9102', date: new Date('2024-01-20'), description: 'Standard Room Stay', points: 1200, type: 'Earned' },
                { id: 'TX-8820', date: new Date('2023-10-05'), description: 'Welcome Bonus', points: 5000, type: 'Earned' }
            ]
        }
    ];

    currentGuest: GuestLoyalty = this.guests[0];

    tiers: LoyaltyTier[] = [
        { name: 'Silver', minPoints: 0, color: '#9e9e9e', benefits: ['Free Wi-Fi', 'Member Rates'] },
        { name: 'Gold', minPoints: 5000, color: '#ffb300', benefits: ['Late Check-out', 'Room Upgrade (Subject to availability)', 'Welcome Drink'] },
        { name: 'Platinum', minPoints: 10000, color: '#e53935', benefits: ['Executive Lounge Access', 'Guaranteed Room Availability', 'Early Check-in'] },
        { name: 'Diamond', minPoints: 25000, color: '#00bcd4', benefits: ['Suite Upgrade', 'Airport Transfer', 'Dedicated Concierge'] }
    ];

    displayedColumns: string[] = ['date', 'description', 'type', 'points'];

    // Redeem state
    isRedeeming: boolean = false;
    redeemAmount: number | null = null;
    redeemDescription: string = '';

    constructor() { }

    ngOnInit(): void {
    }

    onGuestChange(): void {
        this.isRedeeming = false;
        this.redeemAmount = null;
        this.redeemDescription = '';
        // Triggers re-render naturally
    }

    getCurrentTierData(): LoyaltyTier {
        const tier = this.tiers.find(t => t.name === this.currentGuest.currentTier);
        return tier || this.tiers[0];
    }

    getNextTier(): LoyaltyTier | null {
        const currentIndex = this.tiers.findIndex(t => t.name === this.currentGuest.currentTier);
        return currentIndex < this.tiers.length - 1 ? this.tiers[currentIndex + 1] : null;
    }

    getProgress(): number {
        const nextTier = this.getNextTier();
        if (!nextTier) return 100;

        const currentTier = this.getCurrentTierData();
        const range = nextTier.minPoints - currentTier.minPoints;
        const progress = this.currentGuest.points - currentTier.minPoints;

        return (progress / range) * 100;
    }

    startRedeem(): void {
        this.isRedeeming = true;
        this.redeemAmount = null;
        this.redeemDescription = '';
    }

    cancelRedeem(): void {
        this.isRedeeming = false;
    }

    submitRedeem(): void {
        if (this.redeemAmount && this.redeemAmount > 0 && this.redeemAmount <= this.currentGuest.points && this.redeemDescription) {
            this.currentGuest.points -= this.redeemAmount;

            // Check if tier needs updating (downgrade usually doesn't happen on redeem, but depends on logic)
            // For this mock, we won't downgrade tier on redeem.

            this.currentGuest.transactions.unshift({
                id: 'TX-' + Math.floor(Math.random() * 9000 + 1000).toString(),
                date: new Date(),
                description: this.redeemDescription,
                points: -this.redeemAmount,
                type: 'Redeemed'
            });

            // Re-assign array to trigger table update
            this.currentGuest.transactions = [...this.currentGuest.transactions];

            this.isRedeeming = false;
        }
    }
}
