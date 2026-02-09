import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';

@Component({
    selector: 'app-room-availability-dashboard',
    templateUrl: './room-availability-dashboard.html',
    standalone: true,
    imports: [
        CommonModule,
        BreadcrumbComponent
    ]
})
export class RoomAvailabilityDashboardComponent {
    constructor() { }
}
