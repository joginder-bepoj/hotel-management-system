import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';

@Component({
    selector: 'app-cancellation-modification',
    templateUrl: './cancellation-modification.html',
    standalone: true,
    imports: [
        CommonModule,
        BreadcrumbComponent
    ]
})
export class CancellationModificationComponent {
    constructor() { }
}
