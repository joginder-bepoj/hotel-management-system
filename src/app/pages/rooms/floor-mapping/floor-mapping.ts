import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';

@Component({
    selector: 'app-floor-mapping',
    templateUrl: './floor-mapping.html',
    standalone: true,
    imports: [
        CommonModule,
        BreadcrumbComponent
    ]
})
export class FloorMappingComponent {
    constructor() { }
}
