import { Component, ViewChild, OnInit } from '@angular/core';
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
import { RoomService, Room } from '../../../core/service/room.service';
import { RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-all-rooms',
  standalone: true,
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
    RouterModule,
  ],
  templateUrl: './all-rooms.html',
  styleUrl: './all-rooms.scss',
})
export class AllRooms implements OnInit {
  displayedColumns = [
    'select',
    'roomNo',
    'roomType',
    'acNonAc',
    'meal',
    'capacity',
    'rent',
    'actions',
  ];
  dataSource = new MatTableDataSource<Room>([]);
  selection = new SelectionModel<Room>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private roomService: RoomService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.loadRooms();
  }

  loadRooms() {
    this.dataSource.data = this.roomService.getRooms();
  }

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

  deleteRoom(id: number) {
    if (confirm('Are you sure you want to delete this room?')) {
      this.roomService.deleteRoom(id);
      this.loadRooms();
      this.snackBar.open('Room deleted successfully!', 'Close', {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center'
      });
      this.selection.clear();
    }
  }
}
