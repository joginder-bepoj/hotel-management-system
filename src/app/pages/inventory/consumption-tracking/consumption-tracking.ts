import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';

@Component({
    selector: 'app-consumption-tracking',
    templateUrl: './consumption-tracking.html',
    standalone: true,
    imports: [
        CommonModule,
        BreadcrumbComponent
    ]
})
export class ConsumptionTrackingComponent {
    constructor() { }
}
