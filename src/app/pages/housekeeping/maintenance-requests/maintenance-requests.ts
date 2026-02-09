import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

export interface MaintenanceRequest {
    id: number;
    room: string;
    issue: string;
    priority: 'High' | 'Medium' | 'Low';
    status: 'Pending' | 'In Progress' | 'Resolved';
    reportedBy: string;
}

@Component({
    selector: 'app-maintenance-requests',
    templateUrl: './maintenance-requests.html',
    standalone: true,
    imports: [
        CommonModule,
        BreadcrumbComponent,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatTableModule,
        MatIconModule,
        MatChipsModule
    ]
})
export class MaintenanceRequestsComponent {
    requestForm: FormGroup;
    displayedColumns: string[] = ['room', 'issue', 'priority', 'status', 'reportedBy', 'actions'];
    dataSource: MatTableDataSource<MaintenanceRequest>;

    // Mock Data
    requests: MaintenanceRequest[] = [
        { id: 1, room: '101', issue: 'AC not cooling', priority: 'High', status: 'Pending', reportedBy: 'Guest' },
        { id: 2, room: '205', issue: 'Leaky faucet', priority: 'Low', status: 'Resolved', reportedBy: 'Housekeeping' },
        { id: 3, room: '304', issue: 'TV remote broken', priority: 'Medium', status: 'In Progress', reportedBy: 'Guest' },
    ];

    constructor(private fb: FormBuilder) {
        this.requestForm = this.fb.group({
            room: ['', Validators.required],
            issue: ['', Validators.required],
            priority: ['Medium', Validators.required],
            reportedBy: ['', Validators.required]
        });
        this.dataSource = new MatTableDataSource(this.requests);
    }

    submitRequest() {
        if (this.requestForm.valid) {
            const newRequest: MaintenanceRequest = {
                id: this.requests.length + 1,
                ...this.requestForm.value,
                status: 'Pending'
            };
            this.requests.unshift(newRequest); // Add to top
            this.dataSource.data = [...this.requests]; // Refresh table
            this.requestForm.reset({ priority: 'Medium' });
        }
    }

    resolveRequest(request: MaintenanceRequest) {
        request.status = 'Resolved';
    }
}
