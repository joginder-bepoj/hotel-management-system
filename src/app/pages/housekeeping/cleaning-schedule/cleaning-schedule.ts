import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import Swal from 'sweetalert2';

export interface CleaningTask {
    id: number;
    room: string;
    housekeeper: string;
    type: string;
    scheduledTime: string;
    status: 'Pending' | 'In Progress' | 'Completed';
    priority: 'High' | 'Normal' | 'Low';
}

@Component({
    selector: 'app-cleaning-schedule',
    templateUrl: './cleaning-schedule.html',
    styleUrls: ['./cleaning-schedule.scss'],
    standalone: true,
    imports: [
        CommonModule,
        BreadcrumbComponent,
        MatTableModule,
        MatChipsModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatPaginatorModule,
        MatSortModule,
        MatSnackBarModule,
        MatMenuModule
    ]
})
export class CleaningScheduleComponent implements OnInit, AfterViewInit {
    displayedColumns: string[] = ['room', 'housekeeper', 'type', 'scheduledTime', 'priority', 'status', 'actions'];
    dataSource: MatTableDataSource<CleaningTask> = new MatTableDataSource<CleaningTask>([]);

    stats = {
        total: 0,
        pending: 0,
        inProgress: 0,
        completed: 0
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
        const storedData = localStorage.getItem('cleaning_schedule');
        if (storedData) {
            this.dataSource.data = JSON.parse(storedData);
        } else {
            const defaultData: CleaningTask[] = [
                { id: 1, room: '101', housekeeper: 'Sarah Jones', type: 'Full Clean', scheduledTime: '09:00 AM', priority: 'High', status: 'In Progress' },
                { id: 2, room: '102', housekeeper: 'Mike Brown', type: 'Towel Change', scheduledTime: '09:30 AM', priority: 'Normal', status: 'Pending' },
                { id: 3, room: '205', housekeeper: 'Sarah Jones', type: 'Full Clean', scheduledTime: '10:00 AM', priority: 'Normal', status: 'Pending' },
                { id: 4, room: '304', housekeeper: 'Mike Brown', type: 'Deep Clean', scheduledTime: '11:00 AM', priority: 'High', status: 'Pending' },
                { id: 5, room: '401', housekeeper: 'Lisa Ray', type: 'Full Clean', scheduledTime: '08:30 AM', priority: 'Low', status: 'Completed' },
            ];
            this.dataSource.data = defaultData;
            this.saveData();
        }
        this.calculateStats();
    }

    saveData() {
        localStorage.setItem('cleaning_schedule', JSON.stringify(this.dataSource.data));
    }

    calculateStats() {
        const data = this.dataSource.data;
        this.stats = {
            total: data.length,
            pending: data.filter(t => t.status === 'Pending').length,
            inProgress: data.filter(t => t.status === 'In Progress').length,
            completed: data.filter(t => t.status === 'Completed').length
        };
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    updateStatus(task: CleaningTask, newStatus: CleaningTask['status']) {
        task.status = newStatus;
        this.saveData();
        this.calculateStats();
        Swal.fire({
            title: 'Updated!',
            text: `Task for Room ${task.room} updated to ${newStatus}`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        });
    }

    editTask(task: CleaningTask) {
        Swal.fire({
            title: 'Edit Task',
            text: `Editing task for Room ${task.room} (Feature demo)`,
            icon: 'info',
            timer: 2000,
            showConfirmButton: false
        });
    }

    deleteTask(task: CleaningTask) {
        Swal.fire({
            title: 'Are you sure?',
            text: `Are you sure you want to delete the cleaning task for Room ${task.room}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                this.dataSource.data = this.dataSource.data.filter(t => t.id !== task.id);
                this.saveData();
                this.calculateStats();
                Swal.fire(
                    'Deleted!',
                    'Cleaning task has been deleted.',
                    'success'
                );
            }
        });
    }

    addTask() {
        const newTask: CleaningTask = {
            id: Date.now(),
            room: (100 + Math.floor(Math.random() * 400)).toString(),
            housekeeper: 'New Housekeeper',
            type: 'Quick Clean',
            scheduledTime: '12:00 PM',
            priority: 'Normal',
            status: 'Pending'
        };
        this.dataSource.data = [newTask, ...this.dataSource.data];
        this.saveData();
        this.calculateStats();
        Swal.fire({
            title: 'Task Assigned',
            text: `New cleaning task assigned to Room ${newTask.room}`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        });
    }

    getPriorityClass(priority: string): string {
        switch (priority) {
            case 'High': return 'priority-high';
            case 'Normal': return 'priority-normal';
            case 'Low': return 'priority-low';
            default: return '';
        }
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'Pending': return 'status-pending';
            case 'In Progress': return 'status-progress';
            case 'Completed': return 'status-completed';
            default: return '';
        }
    }
}

