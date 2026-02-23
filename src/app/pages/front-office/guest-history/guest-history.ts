import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

export interface GuestHistory {
    id: number;
    name: string;
    contact: string;
    email: string;
    totalStays: number;
    lastVisit: Date | string;
    totalSpent: number;
    rating: number;
}

@Component({
    selector: 'app-guest-history',
    templateUrl: './guest-history.html',
    styleUrls: ['./guest-history.scss'],
    standalone: true,
    imports: [
        CommonModule,
        BreadcrumbComponent,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatTooltipModule,
        MatSnackBarModule
    ]
})
export class GuestHistoryComponent implements OnInit, AfterViewInit {
    displayedColumns: string[] = ['name', 'contact', 'email', 'totalStays', 'lastVisit', 'totalSpent', 'rating', 'actions'];
    dataSource: MatTableDataSource<GuestHistory> = new MatTableDataSource<GuestHistory>([]);

    stats = {
        totalGuests: 0,
        repeatGuests: 0,
        topRated: 0,
        totalRevenue: 0
    };

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(private snackBar: MatSnackBar) {}

    ngOnInit() {
        this.loadData();
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    loadData() {
        const storedData = localStorage.getItem('guest_history');
        if (storedData) {
            const data = JSON.parse(storedData);
            this.dataSource.data = data;
        } else {
            const defaultData: GuestHistory[] = [
                { id: 1, name: 'Alice Johnson', contact: '+1 555-0101', email: 'alice@example.com', totalStays: 3, lastVisit: new Date('2023-09-15').toISOString(), totalSpent: 1200, rating: 5 },
                { id: 2, name: 'Bob Smith', contact: '+1 555-0102', email: 'bob@example.com', totalStays: 1, lastVisit: new Date('2023-10-10').toISOString(), totalSpent: 400, rating: 4 },
                { id: 3, name: 'Charlie Brown', contact: '+1 555-0103', email: 'charlie@example.com', totalStays: 5, lastVisit: new Date('2023-08-20').toISOString(), totalSpent: 2500, rating: 5 },
                { id: 4, name: 'David Lee', contact: '+1 555-0104', email: 'david@example.com', totalStays: 2, lastVisit: new Date('2023-10-01').toISOString(), totalSpent: 800, rating: 3 },
            ];
            this.dataSource.data = defaultData;
            this.saveData();
        }
        this.calculateStats();
    }

    saveData() {
        localStorage.setItem('guest_history', JSON.stringify(this.dataSource.data));
    }

    calculateStats() {
        const data = this.dataSource.data;
        this.stats = {
            totalGuests: data.length,
            repeatGuests: data.filter(g => g.totalStays > 1).length,
            topRated: data.filter(g => g.rating === 5).length,
            totalRevenue: data.reduce((acc, curr) => acc + curr.totalSpent, 0)
        };
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    getStars(rating: number): number[] {
        return Array(rating).fill(0);
    }

    exportData() {
        this.snackBar.open('Guest history data exported successfully', 'Close', { duration: 3000 });
    }

    viewDetails(guest: GuestHistory) {
        this.snackBar.open(`Viewing details for ${guest.name}`, 'Close', { duration: 2000 });
    }
}

