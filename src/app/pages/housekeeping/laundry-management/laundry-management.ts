import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

export interface LaundryOrder {
    id: string;
    guestName: string;
    roomNumber: string;
    items: string;
    status: 'Received' | 'Washing' | 'Ironing' | 'Delivered';
    requestTime: Date;
}

@Component({
    selector: 'app-laundry-management',
    templateUrl: './laundry-management.html',
    standalone: true,
    imports: [
        CommonModule,
        BreadcrumbComponent,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatButtonModule,
        MatIconModule,
        MatChipsModule
    ]
})
export class LaundryManagementComponent implements AfterViewInit {
    displayedColumns: string[] = ['id', 'guestName', 'roomNumber', 'items', 'status', 'requestTime', 'actions'];
    dataSource: MatTableDataSource<LaundryOrder>;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor() {
        const data: LaundryOrder[] = [
            { id: '#L001', guestName: 'John Doe', roomNumber: '101', items: '2 Shirts, 1 Pant', status: 'Washing', requestTime: new Date() },
            { id: '#L002', guestName: 'Alice Smith', roomNumber: '205', items: '1 Dress', status: 'Received', requestTime: new Date() },
            { id: '#L003', guestName: 'Bob Brown', roomNumber: '304', items: '3 T-shirts', status: 'Delivered', requestTime: new Date('2023-10-25') },
            { id: '#L004', guestName: 'Charlie Day', roomNumber: '102', items: '1 Suit', status: 'Ironing', requestTime: new Date() },
        ];
        this.dataSource = new MatTableDataSource(data);
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'Received': return 'badge-solid-orange';
            case 'Washing': return 'badge-solid-blue';
            case 'Ironing': return 'badge-solid-cyan';
            case 'Delivered': return 'badge-solid-green';
            default: return '';
        }
    }
}
