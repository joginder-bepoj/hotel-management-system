import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ENTER, COMMA } from '@angular/cdk/keycodes';

interface Preference {
    category: string;
    items: string[];
    icon: string;
}

interface GuestData {
    id: string;
    name: string;
    avatar: string;
    preferences: Preference[];
    specialRequests: string[];
}

@Component({
    selector: 'app-guest-preferences',
    templateUrl: './guest-preferences.html',
    styleUrls: ['./guest-preferences.scss'],
    standalone: true,
    imports: [
        CommonModule,
        BreadcrumbComponent,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatChipsModule,
        MatAutocompleteModule,
        MatExpansionModule,
        MatSelectModule,
        MatSnackBarModule,
        FormsModule,
        ReactiveFormsModule
    ]
})
export class GuestPreferencesComponent implements OnInit {
    guests: GuestData[] = [
        {
            id: 'GST-1001',
            name: 'Alice Green',
            avatar: 'https://www.einfosoft.com/templates/admin/spiceangular/source/light/assets/images/user/user1.jpg',
            preferences: [
                { category: 'Room Features', items: ['High Floor', 'Quiet Room', 'King Bed'], icon: 'bedroom_parent' },
                { category: 'Food & Beverage', items: ['Vegetarian', 'Red Wine'], icon: 'restaurant' },
                { category: 'Amenities', items: ['Extra Towels'], icon: 'spa' }
            ],
            specialRequests: ['Late Check-out requested for next stay', 'Allergic to peanuts']
        },
        {
            id: 'GST-1002',
            name: 'Robert White',
            avatar: 'https://www.einfosoft.com/templates/admin/spiceangular/source/light/assets/images/user/user2.jpg',
            preferences: [
                { category: 'Room Features', items: ['Balcony', 'Non-Smoking'], icon: 'bedroom_parent' },
                { category: 'Food & Beverage', items: ['Gluten Free', 'Sparkling Water'], icon: 'restaurant' },
                { category: 'Amenities', items: ['Yoga Mat', 'Daily Newspaper'], icon: 'spa' }
            ],
            specialRequests: ['Early check-in needed']
        }
    ];

    currentGuest: GuestData = this.guests[0];

    // Create form controls for each category to handle autocomplete
    tagCtrls: FormControl[] = [];
    filteredTagsList: Observable<string[]>[] = [];

    allTags: string[] = ['Sea View', 'Balcony', 'Corner Room', 'Vegan', 'Gluten Free', 'Newspaper', 'Ironing Board', 'High Floor', 'Quiet Room', 'King Bed', 'Non-Smoking', 'Vegetarian', 'Extra Towels', 'Yoga Mat'];

    readonly separatorKeysCodes = [ENTER, COMMA] as const;

    constructor(private snackBar: MatSnackBar) { }

    ngOnInit(): void {
        this.initControls();
    }

    onGuestChange(): void {
        this.initControls();
    }

    initControls(): void {
        this.tagCtrls = this.currentGuest.preferences.map(() => new FormControl(''));
        this.filteredTagsList = this.tagCtrls.map((ctrl, index) =>
            ctrl.valueChanges.pipe(
                startWith(null),
                map((tag: string | null) => (tag ? this._filter(tag) : this.allTags.slice()))
            )
        );
    }

    add(event: MatChipInputEvent, categoryIndex: number): void {
        const value = (event.value || '').trim();
        if (value && !this.currentGuest.preferences[categoryIndex].items.includes(value)) {
            this.currentGuest.preferences[categoryIndex].items.push(value);
            this.saveChangesSilently();
        }
        event.chipInput!.clear();
        this.tagCtrls[categoryIndex].setValue(null);
    }

    remove(item: string, categoryIndex: number): void {
        const index = this.currentGuest.preferences[categoryIndex].items.indexOf(item);
        if (index >= 0) {
            this.currentGuest.preferences[categoryIndex].items.splice(index, 1);
            this.saveChangesSilently();
        }
    }

    selected(event: MatAutocompleteSelectedEvent, categoryIndex: number, inputElement: HTMLInputElement): void {
        const value = event.option.viewValue;
        if (!this.currentGuest.preferences[categoryIndex].items.includes(value)) {
            this.currentGuest.preferences[categoryIndex].items.push(value);
            this.saveChangesSilently();
        }
        inputElement.value = '';
        this.tagCtrls[categoryIndex].setValue(null);
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.allTags.filter(tag => tag.toLowerCase().includes(filterValue));
    }

    addRequest(note: string, inputElement: HTMLTextAreaElement): void {
        if (note.trim()) {
            this.currentGuest.specialRequests.push(note.trim());
            inputElement.value = '';
            this.saveChangesSilently();
        }
    }

    removeRequest(index: number): void {
        this.currentGuest.specialRequests.splice(index, 1);
        this.saveChangesSilently();
    }

    saveChangesSilently(): void {
        // In a real app, this might trigger a background save
    }

    saveAllPreferences(): void {
        this.snackBar.open('Preferences saved successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
            panelClass: ['snackbar-success']
        });
    }
}
