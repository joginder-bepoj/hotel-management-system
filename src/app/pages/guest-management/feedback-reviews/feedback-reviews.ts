import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';

interface Review {
    id: string;
    guestName: string;
    avatar: string;
    rating: number; // 1-5
    date: Date;
    comment: string;
    stayType: 'Business' | 'Leisure' | 'Family';
    source: 'Google' | 'TripAdvisor' | 'Direct';
}

@Component({
    selector: 'app-feedback-reviews',
    templateUrl: './feedback-reviews.html',
    styleUrls: ['./feedback-reviews.scss'],
    standalone: true,
    imports: [
        CommonModule,
        BreadcrumbComponent,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatProgressBarModule,
        MatChipsModule
    ]
})
export class FeedbackReviewsComponent implements OnInit {
    reviews: Review[] = [
        {
            id: 'REV-101',
            guestName: 'John Doe',
            avatar: 'https://www.einfosoft.com/templates/admin/spiceangular/source/light/assets/images/user/user4.jpg',
            rating: 5,
            date: new Date('2024-02-08'),
            comment: 'Absolutely fantastic stay! The staff went above and beyond.',
            stayType: 'Leisure',
            source: 'TripAdvisor'
        },
        {
            id: 'REV-102',
            guestName: 'Sarah Smith',
            avatar: 'https://www.einfosoft.com/templates/admin/spiceangular/source/light/assets/images/user/user5.jpg',
            rating: 4,
            date: new Date('2024-02-06'),
            comment: 'Great room, but breakfast service was a bit slow.',
            stayType: 'Business',
            source: 'Direct'
        },
        {
            id: 'REV-103',
            guestName: 'Mike Johnson',
            avatar: 'https://www.einfosoft.com/templates/admin/spiceangular/source/light/assets/images/user/user6.jpg',
            rating: 3,
            date: new Date('2024-02-01'),
            comment: 'Average experience. The AC in room 305 was noisy.',
            stayType: 'Family',
            source: 'Google'
        },
        {
            id: 'REV-104',
            guestName: 'Emily Davis',
            avatar: 'https://www.einfosoft.com/templates/admin/spiceangular/source/light/assets/images/user/user7.jpg',
            rating: 5,
            date: new Date('2024-01-28'),
            comment: 'Perfect location and wonderful amenities. Will visit again!',
            stayType: 'Leisure',
            source: 'Direct'
        }
    ];

    stats = {
        averageRating: 4.25,
        totalReviews: 128,
        ratingDistribution: [
            { stars: 5, count: 80, percentage: 62.5 },
            { stars: 4, count: 30, percentage: 23.4 },
            { stars: 3, count: 10, percentage: 7.8 },
            { stars: 2, count: 5, percentage: 3.9 },
            { stars: 1, count: 3, percentage: 2.3 }
        ]
    };

    constructor() { }

    ngOnInit(): void {
    }

    getStarArray(rating: number): number[] {
        return Array(rating).fill(0);
    }

    getEmptyStarArray(rating: number): number[] {
        return Array(5 - rating).fill(0);
    }

    replyToReview(review: Review): void {
        console.log('Reply to review:', review.id);
    }
}
