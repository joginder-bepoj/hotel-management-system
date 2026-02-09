import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

export interface KeyLog {
    id: number;
    roomNumber: string;
    keyId: string;
    guestName: string;
    issuedAt: Date;
    status: 'Active' | 'Returned' | 'Lost';
}

@Component({
    selector: 'app-key-management',
    templateUrl: './key-management.html',
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
export class KeyManagementComponent implements AfterViewInit {
    displayedColumns: string[] = ['roomNumber', 'keyId', 'guestName', 'issuedAt', 'status', 'actions'];
    dataSource: MatTableDataSource<KeyLog>;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor() {
        const data: KeyLog[] = [
            { id: 1, roomNumber: '101', keyId: 'K-101-A', guestName: 'Alice Johnson', issuedAt: new Date(), status: 'Active' },
            { id: 2, roomNumber: '102', keyId: 'K-102-B', guestName: 'Bob Smith', issuedAt: new Date('2023-10-25T10:00:00'), status: 'Returned' },
            { id: 3, roomNumber: '205', keyId: 'K-205-A', guestName: 'Charlie Brown', issuedAt: new Date('2023-10-26T14:30:00'), status: 'Active' },
            { id: 4, roomNumber: '304', keyId: 'K-304-C', guestName: 'David Lee', issuedAt: new Date('2023-10-24T09:15:00'), status: 'Lost' },
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
}
