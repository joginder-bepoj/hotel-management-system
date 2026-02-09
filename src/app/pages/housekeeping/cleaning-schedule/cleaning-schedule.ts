import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface CleaningTask {
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
    standalone: true,
    imports: [
        CommonModule,
        BreadcrumbComponent,
        MatTableModule,
        MatChipsModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule
    ]
})
export class CleaningScheduleComponent {
    displayedColumns: string[] = ['room', 'housekeeper', 'type', 'scheduledTime', 'priority', 'status', 'actions'];
    dataSource: MatTableDataSource<CleaningTask>;

    constructor() {
        const data: CleaningTask[] = [
            { room: '101', housekeeper: 'Sarah Jones', type: 'Full Clean', scheduledTime: '09:00 AM', priority: 'High', status: 'In Progress' },
            { room: '102', housekeeper: 'Mike Brown', type: 'Towel Change', scheduledTime: '09:30 AM', priority: 'Normal', status: 'Pending' },
            { room: '205', housekeeper: 'Sarah Jones', type: 'Full Clean', scheduledTime: '10:00 AM', priority: 'Normal', status: 'Pending' },
            { room: '304', housekeeper: 'Mike Brown', type: 'Deep Clean', scheduledTime: '11:00 AM', priority: 'High', status: 'Pending' },
            { room: '401', housekeeper: 'Lisa Ray', type: 'Full Clean', scheduledTime: '08:30 AM', priority: 'Low', status: 'Completed' },
        ];
        this.dataSource = new MatTableDataSource(data);
    }
}
