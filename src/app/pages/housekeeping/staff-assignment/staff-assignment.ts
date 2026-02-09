import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-staff-assignment',
    templateUrl: './staff-assignment.html',
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
        MatCardModule,
        MatListModule,
        MatIconModule
    ]
})
export class StaffAssignmentComponent {
    assignmentForm: FormGroup;
    staffList = ['Sarah Jones', 'Mike Brown', 'Lisa Ray', 'John Doe'];
    assignments = [
        { staff: 'Sarah Jones', area: 'Floor 1', shift: 'Morning' },
        { staff: 'Mike Brown', area: 'Floor 2', shift: 'Afternoon' },
        { staff: 'Lisa Ray', area: 'Floor 3', shift: 'Morning' }
    ];

    constructor(private fb: FormBuilder) {
        this.assignmentForm = this.fb.group({
            staff: ['', Validators.required],
            area: ['', Validators.required],
            shift: ['', Validators.required]
        });
    }

    assign() {
        if (this.assignmentForm.valid) {
            this.assignments.push(this.assignmentForm.value);
            this.assignmentForm.reset();
        }
    }

    removeAssignment(index: number) {
        this.assignments.splice(index, 1);
    }
}
