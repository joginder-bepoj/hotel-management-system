import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';

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
        MatTabsModule
    ]
})
export class LoyaltyProgramsComponent implements OnInit {
    currentGuest = {
        name: 'Alice Green',
        points: 12500,
        currentTier: 'Platinum'
    };

    tiers: LoyaltyTier[] = [
        { name: 'Silver', minPoints: 0, color: '#9e9e9e', benefits: ['Free Wi-Fi', 'Member Rates'] },
        { name: 'Gold', minPoints: 5000, color: '#ffb300', benefits: ['Late Check-out', 'Room Upgrade (Subject to availability)', 'Welcome Drink'] },
        { name: 'Platinum', minPoints: 10000, color: '#e53935', benefits: ['Executive Lounge Access', 'Guaranteed Room Availability', 'Early Check-in'] },
        { name: 'Diamond', minPoints: 25000, color: '#00bcd4', benefits: ['Suite Upgrade', 'Airport Transfer', 'Dedicated Concierge'] }
    ];

    transactions: PointTransaction[] = [
        { id: 'TX-9001', date: new Date('2024-02-05'), description: 'Stay at Luxury Suite', points: 2500, type: 'Earned' },
        { id: 'TX-8050', date: new Date('2024-01-15'), description: 'Spa Treatment', points: 500, type: 'Earned' },
        { id: 'TX-7020', date: new Date('2023-12-25'), description: 'Redeemed for Free Night', points: -5000, type: 'Redeemed' },
        { id: 'TX-6005', date: new Date('2023-11-10'), description: 'Restaurant Bill', points: 350, type: 'Earned' }
    ];

    displayedColumns: string[] = ['date', 'description', 'type', 'points'];

    constructor() { }

    ngOnInit(): void {
    }

    getNextTier(): LoyaltyTier | null {
        const currentIndex = this.tiers.findIndex(t => t.name === this.currentGuest.currentTier);
        return currentIndex < this.tiers.length - 1 ? this.tiers[currentIndex + 1] : null;
    }

    getProgress(): number {
        const nextTier = this.getNextTier();
        if (!nextTier) return 100;
        
        const currentTier = this.tiers.find(t => t.name === this.currentGuest.currentTier);
        const range = nextTier.minPoints - (currentTier ? currentTier.minPoints : 0);
        const progress = this.currentGuest.points - (currentTier ? currentTier.minPoints : 0);
        
        return (progress / range) * 100;
    }

    redeemPoints(): void {
        console.log('Redeem points clicked');
    }
}
