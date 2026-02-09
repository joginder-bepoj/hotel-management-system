import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';

@Component({
    selector: 'app-booking-calendar',
    templateUrl: './booking-calendar.html',
    standalone: true,
    imports: [
        CommonModule,
        BreadcrumbComponent
    ]
})
export class BookingCalendarComponent {
    constructor() { }
}
