import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

export interface KeyLog {
    id: number;
    roomNumber: string;
    keyId: string;
    guestName: string;
    issuedAt: Date | string;
    status: 'Active' | 'Returned' | 'Lost';
    keyReceived: boolean;
}

@Component({
    selector: 'app-key-management',
    templateUrl: './key-management.html',
    styleUrls: ['./key-management.scss'],
    standalone: true,
    imports: [
        CommonModule,
        BreadcrumbComponent,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatButtonModule,
        MatIconModule,
        MatChipsModule,
        MatTooltipModule,
        MatSnackBarModule
    ]
})
export class KeyManagementComponent implements OnInit, AfterViewInit {
    displayedColumns: string[] = ['roomNumber', 'keyId', 'guestName', 'issuedAt', 'status', 'keyReceived', 'actions'];
    dataSource: MatTableDataSource<KeyLog> = new MatTableDataSource<KeyLog>([]);
    
    stats = {
        total: 0,
        active: 0,
        returned: 0,
        lost: 0
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
        const storedData = localStorage.getItem('key_logs');
        if (storedData) {
            const data = JSON.parse(storedData);
            this.dataSource.data = data;
        } else {
            const defaultData: KeyLog[] = [
                { id: 1, roomNumber: '101', keyId: 'K-101-A', guestName: 'Alice Johnson', issuedAt: new Date().toISOString(), status: 'Active', keyReceived: true },
                { id: 2, roomNumber: '102', keyId: 'K-102-B', guestName: 'Bob Smith', issuedAt: new Date('2023-10-25T10:00:00').toISOString(), status: 'Returned', keyReceived: true },
                { id: 3, roomNumber: '205', keyId: 'K-205-A', guestName: 'Charlie Brown', issuedAt: new Date('2023-10-26T14:30:00').toISOString(), status: 'Active', keyReceived: false },
                { id: 4, roomNumber: '304', keyId: 'K-304-C', guestName: 'David Lee', issuedAt: new Date('2023-10-24T09:15:00').toISOString(), status: 'Lost', keyReceived: true },
            ];
            this.dataSource.data = defaultData;
            this.saveData();
        }
        this.calculateStats();
    }

    saveData() {
        localStorage.setItem('key_logs', JSON.stringify(this.dataSource.data));
    }

    calculateStats() {
        const data = this.dataSource.data;
        this.stats = {
            total: data.length,
            active: data.filter(k => k.status === 'Active').length,
            returned: data.filter(k => k.status === 'Returned').length,
            lost: data.filter(k => k.status === 'Lost').length
        };
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    returnKey(row: KeyLog) {
        row.status = 'Returned';
        row.keyReceived = true;
        this.saveData();
        this.calculateStats();
        Swal.fire({
            title: 'Key Returned',
            text: `Key ${row.keyId} for Room ${row.roomNumber} returned successfully`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        });
    }

    reportLost(row: KeyLog) {
        row.status = 'Lost';
        row.keyReceived = false;
        this.saveData();
        this.calculateStats();
        Swal.fire({
            title: 'Reported Lost',
            text: `Key ${row.keyId} for Room ${row.roomNumber} reported as LOST`,
            icon: 'warning',
            timer: 2000,
            showConfirmButton: false
        });
    }

    addKeyLog() {
        // For now, let's just add a dummy entry to demonstrate dynamic nature
        const newLog: KeyLog = {
            id: Date.now(),
            roomNumber: (Math.floor(Math.random() * 500) + 100).toString(),
            keyId: 'K-' + Math.floor(Math.random() * 1000).toString(),
            guestName: 'New Guest',
            issuedAt: new Date().toISOString(),
            status: 'Active',
            keyReceived: true
        };
        this.dataSource.data = [newLog, ...this.dataSource.data];
        this.saveData();
        this.calculateStats();
        Swal.fire({
            title: 'Added!',
            text: `New Key Log added for Room ${newLog.roomNumber}`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        });
    }
}

