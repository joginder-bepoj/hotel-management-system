import { Component, ViewChild } from '@angular/core';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { MatIcon } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-all-booking',
  imports: [
    BreadcrumbComponent,
    MatIcon,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatButtonModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
  ],
  templateUrl: './all-booking.html',
  styleUrl: './all-booking.scss',
})
export class AllBooking {
  displayedColumns = [
    'select',
    'name',
    'email',
    'arrival',
    'departure',
    'gender',
    'mobile',
    'roomType',
    'payment',
    'actions',
  ];
  dataSource = new MatTableDataSource<Booking>(BOOKING_DATA);
  selection = new SelectionModel<Booking>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  isAllSelected() {
    return this.selection.selected.length === this.dataSource.data.length;
  }

  toggleAllRows() {
    this.isAllSelected() ? this.selection.clear() : this.selection.select(...this.dataSource.data);
  }
}
export interface Booking {
  name: string;
  email: string;
  arrival: string;
  departure: string;
  gender: string;
  mobile: string;
  roomType: string;
  payment: string;
}

const BOOKING_DATA: Booking[] = [
  {
    name: 'Pooja Patel',
    email: 'test@email.com',
    arrival: '02/09/2018',
    departure: '02/15/2018',
    gender: 'male',
    mobile: '1234567890',
    roomType: 'Super Delux',
    payment: 'Unpaid',
  },
];
