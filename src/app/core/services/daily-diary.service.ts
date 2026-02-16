import { Injectable } from '@angular/core';

export interface DailyExpense {
    id: number;
    category: string;
    description: string;
    payment: string;
    amount: number;
}

export interface DailyIssue {
    id: number;
    areaRoom: string;
    issue: string;
    status: 'Open' | 'Resolved';
    carriedFrom?: string;
}

export interface DailyEvent {
    id: number;
    time: string;
    note: string;
    status: 'Open' | 'Resolved';
}

export interface DailyDiary {
    id: number;
    date: string;
    shift: 'Morning' | 'Evening' | 'Night';
    totalIncome: number;
    expenses: DailyExpense[];
    issues: DailyIssue[];
    events: DailyEvent[];
    isDraft: boolean;
    isCompleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

@Injectable({
    providedIn: 'root'
})
export class DailyDiaryService {
    private diaries: DailyDiary[] = [
        {
            id: 1,
            date: '2026-02-13',
            shift: 'Morning',
            totalIncome: 30000,
            expenses: [
                { id: 1, category: 'Kitchen', description: 'Vegetables', payment: 'Cash', amount: 2500 },
                { id: 2, category: 'Repair', description: 'Pipe Fix', payment: 'Online', amount: 2700 }
            ],
            issues: [
                { id: 1, areaRoom: 'Room 201', issue: 'AC Not Cooling', status: 'Open' },
                { id: 2, areaRoom: 'Lobby', issue: 'Carried from Feb 12', status: 'Resolved', carriedFrom: 'Feb 12' }
            ],
            events: [
                { id: 1, time: '10:30 AM', note: 'VIP guest arrival', status: 'Open' },
                { id: 2, time: '4:00 PM', note: 'Power outage 30 min', status: 'Resolved' }
            ],
            isDraft: false,
            isCompleted: true,
            createdAt: new Date('2026-02-13T08:00:00'),
            updatedAt: new Date('2026-02-13T18:00:00')
        }
    ];

    private nextDiaryId = 2;
    private nextExpenseId = 3;
    private nextIssueId = 3;
    private nextEventId = 3;

    constructor() { }

    // Diary Methods
    getDiaryByDateAndShift(date: string, shift: string): DailyDiary | undefined {
        return this.diaries.find(d => d.date === date && d.shift === shift);
    }

    getAllDiaries(): DailyDiary[] {
        return [...this.diaries];
    }

    createDiary(date: string, shift: 'Morning' | 'Evening' | 'Night', income: number = 0): DailyDiary {
        const newDiary: DailyDiary = {
            id: this.nextDiaryId++,
            date,
            shift,
            totalIncome: income,
            expenses: [],
            issues: [],
            events: [],
            isDraft: true,
            isCompleted: false,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.diaries.push(newDiary);
        return newDiary;
    }

    saveDiary(diary: DailyDiary): void {
        const index = this.diaries.findIndex(d => d.id === diary.id);
        if (index !== -1) {
            diary.updatedAt = new Date();
            this.diaries[index] = diary;
        }
    }

    markAsCompleted(diaryId: number): void {
        const diary = this.diaries.find(d => d.id === diaryId);
        if (diary) {
            diary.isCompleted = true;
            diary.isDraft = false;
            diary.updatedAt = new Date();
        }
    }

    // Expense Methods
    addExpense(diaryId: number, expense: Omit<DailyExpense, 'id'>): DailyExpense {
        const diary = this.diaries.find(d => d.id === diaryId);
        if (diary) {
            const newExpense: DailyExpense = {
                ...expense,
                id: this.nextExpenseId++
            };
            diary.expenses.push(newExpense);
            diary.updatedAt = new Date();
            return newExpense;
        }
        throw new Error('Diary not found');
    }

    updateExpense(diaryId: number, expense: DailyExpense): void {
        const diary = this.diaries.find(d => d.id === diaryId);
        if (diary) {
            const index = diary.expenses.findIndex(e => e.id === expense.id);
            if (index !== -1) {
                diary.expenses[index] = expense;
                diary.updatedAt = new Date();
            }
        }
    }

    deleteExpense(diaryId: number, expenseId: number): void {
        const diary = this.diaries.find(d => d.id === diaryId);
        if (diary) {
            diary.expenses = diary.expenses.filter(e => e.id !== expenseId);
            diary.updatedAt = new Date();
        }
    }

    // Issue Methods
    addIssue(diaryId: number, issue: Omit<DailyIssue, 'id'>): DailyIssue {
        const diary = this.diaries.find(d => d.id === diaryId);
        if (diary) {
            const newIssue: DailyIssue = {
                ...issue,
                id: this.nextIssueId++
            };
            diary.issues.push(newIssue);
            diary.updatedAt = new Date();
            return newIssue;
        }
        throw new Error('Diary not found');
    }

    updateIssue(diaryId: number, issue: DailyIssue): void {
        const diary = this.diaries.find(d => d.id === diaryId);
        if (diary) {
            const index = diary.issues.findIndex(i => i.id === issue.id);
            if (index !== -1) {
                diary.issues[index] = issue;
                diary.updatedAt = new Date();
            }
        }
    }

    deleteIssue(diaryId: number, issueId: number): void {
        const diary = this.diaries.find(d => d.id === diaryId);
        if (diary) {
            diary.issues = diary.issues.filter(i => i.id !== issueId);
            diary.updatedAt = new Date();
        }
    }

    // Event Methods
    addEvent(diaryId: number, event: Omit<DailyEvent, 'id'>): DailyEvent {
        const diary = this.diaries.find(d => d.id === diaryId);
        if (diary) {
            const newEvent: DailyEvent = {
                ...event,
                id: this.nextEventId++
            };
            diary.events.push(newEvent);
            diary.updatedAt = new Date();
            return newEvent;
        }
        throw new Error('Diary not found');
    }

    updateEvent(diaryId: number, event: DailyEvent): void {
        const diary = this.diaries.find(d => d.id === diaryId);
        if (diary) {
            const index = diary.events.findIndex(e => e.id === event.id);
            if (index !== -1) {
                diary.events[index] = event;
                diary.updatedAt = new Date();
            }
        }
    }

    deleteEvent(diaryId: number, eventId: number): void {
        const diary = this.diaries.find(d => d.id === diaryId);
        if (diary) {
            diary.events = diary.events.filter(e => e.id !== eventId);
            diary.updatedAt = new Date();
        }
    }

    // Calculation Methods
    calculateTotalExpense(diaryId: number): number {
        const diary = this.diaries.find(d => d.id === diaryId);
        if (diary) {
            return diary.expenses.reduce((sum, expense) => sum + expense.amount, 0);
        }
        return 0;
    }

    calculateNetResult(diaryId: number): number {
        const diary = this.diaries.find(d => d.id === diaryId);
        if (diary) {
            const totalExpense = this.calculateTotalExpense(diaryId);
            return diary.totalIncome - totalExpense;
        }
        return 0;
    }

    updateIncome(diaryId: number, income: number): void {
        const diary = this.diaries.find(d => d.id === diaryId);
        if (diary) {
            diary.totalIncome = income;
            diary.updatedAt = new Date();
        }
    }
}
