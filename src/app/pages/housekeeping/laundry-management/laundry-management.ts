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
import { MatMenuModule } from '@angular/material/menu';

export interface LaundryOrder {
    id: string;
    guestName: string;
    roomNumber: string;
    items: string;
    status: 'Received' | 'Washing' | 'Ironing' | 'Delivered' | 'Cancelled';
    requestTime: string | Date;
    cost: number;
}

@Component({
    selector: 'app-laundry-management',
    templateUrl: './laundry-management.html',
    styleUrls: ['./laundry-management.scss'],
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
        MatSnackBarModule,
        MatMenuModule
    ]
})
export class LaundryManagementComponent implements OnInit, AfterViewInit {
    displayedColumns: string[] = ['id', 'guestName', 'roomNumber', 'items', 'cost', 'status', 'requestTime', 'actions'];
    dataSource: MatTableDataSource<LaundryOrder> = new MatTableDataSource<LaundryOrder>([]);

    stats = {
        totalOrders: 0,
        pending: 0,
        inProgress: 0,
        delivered: 0,
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
        const storedData = localStorage.getItem('laundry_orders');
        if (storedData) {
            this.dataSource.data = JSON.parse(storedData);
        } else {
            const defaultData: LaundryOrder[] = [
                { id: 'L-1001', guestName: 'John Doe', roomNumber: '101', items: '2 Shirts, 1 Pant', status: 'Washing', requestTime: new Date().toISOString(), cost: 45.50 },
                { id: 'L-1002', guestName: 'Alice Smith', roomNumber: '205', items: '1 Dress', status: 'Received', requestTime: new Date().toISOString(), cost: 25.00 },
                { id: 'L-1003', guestName: 'Bob Brown', roomNumber: '304', items: '3 T-shirts', status: 'Delivered', requestTime: new Date('2024-02-21').toISOString(), cost: 15.75 },
                { id: 'L-1004', guestName: 'Charlie Day', roomNumber: '102', items: '1 Suit', status: 'Ironing', requestTime: new Date().toISOString(), cost: 60.00 },
            ];
            this.dataSource.data = defaultData;
            this.saveData();
        }
        this.calculateStats();
    }

    saveData() {
        localStorage.setItem('laundry_orders', JSON.stringify(this.dataSource.data));
    }

    calculateStats() {
        const data = this.dataSource.data;
        this.stats = {
            totalOrders: data.length,
            pending: data.filter(o => o.status === 'Received').length,
            inProgress: data.filter(o => o.status === 'Washing' || o.status === 'Ironing').length,
            delivered: data.filter(o => o.status === 'Delivered').length,
            totalRevenue: data.reduce((acc, curr) => acc + (curr.status !== 'Cancelled' ? curr.cost : 0), 0)
        };
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    updateStatus(order: LaundryOrder, newStatus: LaundryOrder['status']) {
        order.status = newStatus;
        this.saveData();
        this.calculateStats();
        this.snackBar.open(`Order ${order.id} updated to ${newStatus}`, 'Close', { duration: 3000 });
    }

    addOrder() {
        const newOrder: LaundryOrder = {
            id: 'L-' + (1000 + this.dataSource.data.length + 1),
            guestName: 'New Guest',
            roomNumber: (100 + Math.floor(Math.random() * 400)).toString(),
            items: 'Random Items',
            status: 'Received',
            requestTime: new Date().toISOString(),
            cost: Math.floor(Math.random() * 50) + 10
        };
        this.dataSource.data = [newOrder, ...this.dataSource.data];
        this.saveData();
        this.calculateStats();
        this.snackBar.open(`New laundry order created: ${newOrder.id}`, 'Close', { duration: 3000 });
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'Received': return 'status-received';
            case 'Washing': return 'status-washing';
            case 'Ironing': return 'status-ironing';
            case 'Delivered': return 'status-delivered';
            case 'Cancelled': return 'status-cancelled';
            default: return '';
        }
    }
}

