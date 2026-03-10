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
    private readonly STORAGE_KEY = 'hotel_diary_data';
    private diaries: DailyDiary[] = [];

    constructor() {
        this.loadFromStorage();
    }

    private loadFromStorage(): void {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
            try {
                this.diaries = JSON.parse(stored);
                // Convert string dates back to Date objects
                this.diaries.forEach(d => {
                    d.createdAt = new Date(d.createdAt);
                    d.updatedAt = new Date(d.updatedAt);
                });
            } catch (e) {
                console.error('Error parsing diary data from storage', e);
                this.diaries = [];
            }
        }

        // Initialize with default data if empty
        if (this.diaries.length === 0) {
            this.diaries = [
                {
                    id: 1,
                    date: new Date().toISOString().split('T')[0],
                    shift: 'Morning',
                    totalIncome: 30000,
                    expenses: [
                        { id: 1, category: 'Kitchen', description: 'Vegetables', payment: 'Cash', amount: 2500 }
                    ],
                    issues: [
                        { id: 1, areaRoom: 'Room 201', issue: 'AC Not Cooling', status: 'Open' }
                    ],
                    events: [
                        { id: 1, time: '10:30 AM', note: 'VIP guest arrival', status: 'Open' }
                    ],
                    isDraft: true,
                    isCompleted: false,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ];
            this.saveToStorage();
        }
    }

    private saveToStorage(): void {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.diaries));
    }

    private getNextDiaryId(): number {
        return this.diaries.length > 0 ? Math.max(...this.diaries.map(d => d.id)) + 1 : 1;
    }

    private getNextExpenseId(diary: DailyDiary): number {
        return diary.expenses.length > 0 ? Math.max(...diary.expenses.map(e => e.id)) + 1 : 1;
    }

    private getNextIssueId(diary: DailyDiary): number {
        return diary.issues.length > 0 ? Math.max(...diary.issues.map(i => i.id)) + 1 : 1;
    }

    private getNextEventId(diary: DailyDiary): number {
        return diary.events.length > 0 ? Math.max(...diary.events.map(e => e.id)) + 1 : 1;
    }

    // Diary Methods
    getDiaryByDateAndShift(date: string, shift: string): DailyDiary | undefined {
        return this.diaries.find(d => d.date === date && d.shift === shift);
    }

    getAllDiaries(): DailyDiary[] {
        return [...this.diaries];
    }

    createDiary(date: string, shift: 'Morning' | 'Evening' | 'Night', income: number = 0): DailyDiary {
        const newDiary: DailyDiary = {
            id: this.getNextDiaryId(),
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
        this.saveToStorage();
        return newDiary;
    }

    saveDiary(diary: DailyDiary): void {
        const index = this.diaries.findIndex(d => d.id === diary.id);
        if (index !== -1) {
            diary.updatedAt = new Date();
            this.diaries[index] = { ...diary };
            this.saveToStorage();
        }
    }

    markAsCompleted(diaryId: number): void {
        const diary = this.diaries.find(d => d.id === diaryId);
        if (diary) {
            diary.isCompleted = true;
            diary.isDraft = false;
            diary.updatedAt = new Date();
            this.saveToStorage();
        }
    }

    // Expense Methods
    addExpense(diaryId: number, expense: Omit<DailyExpense, 'id'>): DailyExpense {
        const diary = this.diaries.find(d => d.id === diaryId);
        if (diary) {
            const newExpense: DailyExpense = {
                ...expense,
                id: this.getNextExpenseId(diary)
            };
            diary.expenses.push(newExpense);
            diary.updatedAt = new Date();
            this.saveToStorage();
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
                this.saveToStorage();
            }
        }
    }

    deleteExpense(diaryId: number, expenseId: number): void {
        const diary = this.diaries.find(d => d.id === diaryId);
        if (diary) {
            diary.expenses = diary.expenses.filter(e => e.id !== expenseId);
            diary.updatedAt = new Date();
            this.saveToStorage();
        }
    }

    // Issue Methods
    addIssue(diaryId: number, issue: Omit<DailyIssue, 'id'>): DailyIssue {
        const diary = this.diaries.find(d => d.id === diaryId);
        if (diary) {
            const newIssue: DailyIssue = {
                ...issue,
                id: this.getNextIssueId(diary)
            };
            diary.issues.push(newIssue);
            diary.updatedAt = new Date();
            this.saveToStorage();
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
                this.saveToStorage();
            }
        }
    }

    deleteIssue(diaryId: number, issueId: number): void {
        const diary = this.diaries.find(d => d.id === diaryId);
        if (diary) {
            diary.issues = diary.issues.filter(i => i.id !== issueId);
            diary.updatedAt = new Date();
            this.saveToStorage();
        }
    }

    // Event Methods
    addEvent(diaryId: number, event: Omit<DailyEvent, 'id'>): DailyEvent {
        const diary = this.diaries.find(d => d.id === diaryId);
        if (diary) {
            const newEvent: DailyEvent = {
                ...event,
                id: this.getNextEventId(diary)
            };
            diary.events.push(newEvent);
            diary.updatedAt = new Date();
            this.saveToStorage();
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
                this.saveToStorage();
            }
        }
    }

    deleteEvent(diaryId: number, eventId: number): void {
        const diary = this.diaries.find(d => d.id === diaryId);
        if (diary) {
            diary.events = diary.events.filter(e => e.id !== eventId);
            diary.updatedAt = new Date();
            this.saveToStorage();
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
            return (diary.totalIncome || 0) - totalExpense;
        }
        return 0;
    }

    updateIncome(diaryId: number, income: number): void {
        const diary = this.diaries.find(d => d.id === diaryId);
        if (diary) {
            diary.totalIncome = income;
            diary.updatedAt = new Date();
            this.saveToStorage();
        }
    }
}
