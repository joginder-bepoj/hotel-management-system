import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface GuestHistory {
    id: number;
    name: string;
    contact: string;
    email: string;
    totalStays: number;
    lastVisit: Date;
    totalSpent: number;
    rating: number;
}

@Component({
    selector: 'app-guest-history',
    templateUrl: './guest-history.html',
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
        MatInputModule
    ]
})
export class GuestHistoryComponent implements AfterViewInit {
    displayedColumns: string[] = ['name', 'contact', 'email', 'totalStays', 'lastVisit', 'totalSpent', 'rating', 'actions'];
    dataSource: MatTableDataSource<GuestHistory>;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor() {
        const data: GuestHistory[] = [
            { id: 1, name: 'Alice Johnson', contact: '+1 555-0101', email: 'alice@example.com', totalStays: 3, lastVisit: new Date('2023-09-15'), totalSpent: 1200, rating: 5 },
            { id: 2, name: 'Bob Smith', contact: '+1 555-0102', email: 'bob@example.com', totalStays: 1, lastVisit: new Date('2023-10-10'), totalSpent: 400, rating: 4 },
            { id: 3, name: 'Charlie Brown', contact: '+1 555-0103', email: 'charlie@example.com', totalStays: 5, lastVisit: new Date('2023-08-20'), totalSpent: 2500, rating: 5 },
            { id: 4, name: 'David Lee', contact: '+1 555-0104', email: 'david@example.com', totalStays: 2, lastVisit: new Date('2023-10-01'), totalSpent: 800, rating: 3 },
        ];
        this.dataSource = new MatTableDataSource(data);
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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
}
