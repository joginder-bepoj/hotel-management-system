import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';

@Component({
    selector: 'app-room-status-monitoring',
    templateUrl: './room-status-monitoring.html',
    standalone: true,
    imports: [
        CommonModule,
        BreadcrumbComponent
    ]
})
export class RoomStatusMonitoringComponent {
    constructor() { }
}
