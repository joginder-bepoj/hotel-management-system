import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { DailyDiaryService, DailyDiary, DailyExpense, DailyIssue, DailyEvent } from '../../core/services/daily-diary.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-daily-diary',
    templateUrl: './daily-diary.html',
    styleUrls: ['./daily-diary.scss'],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        MatDatepickerModule,
        MatNativeDateModule,
        BreadcrumbComponent
    ]
})
export class DailyDiaryComponent implements OnInit, OnDestroy {
    currentDiary?: DailyDiary;
    selectedDate: Date = new Date();
    selectedShift: 'Morning' | 'Evening' | 'Night' = 'Morning';

    totalIncome: number = 0;
    totalExpense: number = 0;
    netResult: number = 0;

    // Forms
    expenseForm: FormGroup;
    issueForm: FormGroup;
    eventForm: FormGroup;

    // UI States
    showExpenseForm: boolean = false;
    showIssueForm: boolean = false;
    showEventForm: boolean = false;
    isEditingIncome: boolean = false;
    editedIncome: number = 0;
    editingExpense?: DailyExpense;
    editingIssue?: DailyIssue;
    editingEvent?: DailyEvent;

    // Auto-save interval
    private autoSaveInterval: any;

    constructor(
        private fb: FormBuilder,
        private diaryService: DailyDiaryService
    ) {
        this.expenseForm = this.fb.group({
            category: ['', Validators.required],
            description: ['', Validators.required],
            payment: ['', Validators.required],
            amount: ['', [Validators.required, Validators.min(0)]]
        });

        this.issueForm = this.fb.group({
            areaRoom: ['', Validators.required],
            issue: ['', Validators.required],
            status: ['Open', Validators.required],
            carriedFrom: ['']
        });

        this.eventForm = this.fb.group({
            time: ['', Validators.required],
            note: ['', Validators.required],
            status: ['Open', Validators.required]
        });
    }

    ngOnInit() {
        this.loadDiary();
        this.startAutoSave();
    }

    ngOnDestroy() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }
    }

    loadDiary() {
        const dateStr = this.formatDate(this.selectedDate);
        let diary = this.diaryService.getDiaryByDateAndShift(dateStr, this.selectedShift);

        if (!diary) {
            diary = this.diaryService.createDiary(dateStr, this.selectedShift, 30000); // Default income
        }

        this.currentDiary = diary;
        this.calculateTotals();
    }

    formatDate(date: Date): string {
        return date.toISOString().split('T')[0];
    }

    onDateChange(date: Date) {
        this.selectedDate = date;
        this.loadDiary();
    }

    onShiftChange(shift: 'Morning' | 'Evening' | 'Night') {
        this.selectedShift = shift;
        this.loadDiary();
    }

    calculateTotals() {
        if (this.currentDiary) {
            this.totalIncome = this.currentDiary.totalIncome;
            this.totalExpense = this.diaryService.calculateTotalExpense(this.currentDiary.id);
            this.netResult = this.diaryService.calculateNetResult(this.currentDiary.id);
        }
    }

    editIncome() {
        if (this.isReadOnly()) return;
        this.editedIncome = this.totalIncome;
        this.isEditingIncome = true;
    }

    saveIncome() {
        if (this.currentDiary && this.editedIncome >= 0) {
            this.diaryService.updateIncome(this.currentDiary.id, this.editedIncome);
            this.isEditingIncome = false;
            this.loadDiary();
            Swal.fire({
                title: 'Saved!',
                text: 'Income updated successfully',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
        }
    }

    // Expense Methods
    addExpense() {
        this.showExpenseForm = true;
        this.editingExpense = undefined;
        this.expenseForm.reset();
    }

    saveExpense() {
        if (this.expenseForm.valid && this.currentDiary) {
            if (this.editingExpense) {
                const updatedExpense: DailyExpense = {
                    ...this.editingExpense,
                    ...this.expenseForm.value
                };
                this.diaryService.updateExpense(this.currentDiary.id, updatedExpense);
            } else {
                this.diaryService.addExpense(this.currentDiary.id, this.expenseForm.value);
            }
            this.showExpenseForm = false;
            this.loadDiary();
            Swal.fire({
                title: 'Saved!',
                text: 'Expense saved successfully',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
        }
    }

    editExpense(expense: DailyExpense) {
        this.editingExpense = expense;
        this.expenseForm.patchValue(expense);
        this.showExpenseForm = true;
    }

    deleteExpense(expenseId: number) {
        if (!this.currentDiary) return;
        
        Swal.fire({
            title: 'Delete Expense?',
            text: "Are you sure you want to delete this expense?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed && this.currentDiary) {
                this.diaryService.deleteExpense(this.currentDiary.id, expenseId);
                this.loadDiary();
                Swal.fire('Deleted!', 'Expense has been deleted.', 'success');
            }
        });
    }

    // Issue Methods
    addIssue() {
        this.showIssueForm = true;
        this.editingIssue = undefined;
        this.issueForm.reset({ status: 'Open' });
    }

    saveIssue() {
        if (this.issueForm.valid && this.currentDiary) {
            if (this.editingIssue) {
                const updatedIssue: DailyIssue = {
                    ...this.editingIssue,
                    ...this.issueForm.value
                };
                this.diaryService.updateIssue(this.currentDiary.id, updatedIssue);
            } else {
                this.diaryService.addIssue(this.currentDiary.id, this.issueForm.value);
            }
            this.showIssueForm = false;
            this.loadDiary();
            Swal.fire({
                title: 'Saved!',
                text: 'Issue saved successfully',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
        }
    }

    editIssue(issue: DailyIssue) {
        this.editingIssue = issue;
        this.issueForm.patchValue(issue);
        this.showIssueForm = true;
    }

    deleteIssue(issueId: number) {
        if (!this.currentDiary) return;
        
        Swal.fire({
            title: 'Delete Issue?',
            text: "Are you sure you want to delete this issue?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed && this.currentDiary) {
                this.diaryService.deleteIssue(this.currentDiary.id, issueId);
                this.loadDiary();
                Swal.fire('Deleted!', 'Issue has been deleted.', 'success');
            }
        });
    }

    // Event Methods
    addEvent() {
        this.showEventForm = true;
        this.editingEvent = undefined;
        this.eventForm.reset({ status: 'Open' });
    }

    saveEvent() {
        if (this.eventForm.valid && this.currentDiary) {
            if (this.editingEvent) {
                const updatedEvent: DailyEvent = {
                    ...this.editingEvent,
                    ...this.eventForm.value
                };
                this.diaryService.updateEvent(this.currentDiary.id, updatedEvent);
            } else {
                this.diaryService.addEvent(this.currentDiary.id, this.eventForm.value);
            }
            this.showEventForm = false;
            this.loadDiary();
            Swal.fire({
                title: 'Saved!',
                text: 'Event saved successfully',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
        }
    }

    editEvent(event: DailyEvent) {
        this.editingEvent = event;
        this.eventForm.patchValue(event);
        this.showEventForm = true;
    }

    deleteEvent(eventId: number) {
        if (!this.currentDiary) return;
        
        Swal.fire({
            title: 'Delete Event?',
            text: "Are you sure you want to delete this event?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed && this.currentDiary) {
                this.diaryService.deleteEvent(this.currentDiary.id, eventId);
                this.loadDiary();
                Swal.fire('Deleted!', 'Event has been deleted.', 'success');
            }
        });
    }

    // Diary Actions
    saveDraft() {
        if (this.currentDiary) {
            this.diaryService.saveDiary(this.currentDiary);
            Swal.fire({
                title: 'Saved!',
                text: 'Draft saved successfully',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
        }
    }

    markAsCompleted() {
        if (this.currentDiary) {
            Swal.fire({
                title: 'Mark as Completed?',
                text: "You won't be able to edit this diary afterwards.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#aaa',
                confirmButtonText: 'Yes, complete it!'
            }).then((result) => {
                if (result.isConfirmed && this.currentDiary) {
                    this.diaryService.markAsCompleted(this.currentDiary.id);
                    this.loadDiary();
                    Swal.fire('Completed!', 'Diary has been marked as completed.', 'success');
                }
            });
        }
    }

    closeDay() {
        this.markAsCompleted();
    }

    startAutoSave() {
        this.autoSaveInterval = setInterval(() => {
            if (this.currentDiary && this.currentDiary.isDraft) {
                this.diaryService.saveDiary(this.currentDiary);
            }
        }, 30000); // Auto-save every 30 seconds
    }

    isReadOnly(): boolean {
        return this.currentDiary?.isCompleted || false;
    }
}
