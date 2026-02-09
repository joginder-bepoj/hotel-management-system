import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

interface Preference {
    category: string;
    items: string[];
    icon: string;
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
        FormsModule,
        ReactiveFormsModule
    ]
})
export class GuestPreferencesComponent implements OnInit {
    // Mock guest for context
    currentGuest = {
        name: 'Alice Green',
        id: 'GST-1001',
        avatar: 'https://www.einfosoft.com/templates/admin/spiceangular/source/light/assets/images/user/user1.jpg'
    };

    preferences: Preference[] = [
        { category: 'Room Features', items: ['High Floor', 'Quiet Room', 'King Bed', 'Non-Smoking'], icon: 'bedroom_parent' },
        { category: 'Food & Beverage', items: ['Vegetarian', 'No Dairy', 'Extra Spicy', 'Red Wine'], icon: 'restaurant' },
        { category: 'Amenities', items: ['Extra Towels', 'Soft Pillow', 'Yoga Mat'], icon: 'spa' }
    ];

    specialRequests: string[] = [
        'Late Check-out requested for next stay',
        'Allergic to peanuts'
    ];

    // Form controls for adding new preferences
    tagCtrl = new FormControl('');
    filteredTags: Observable<string[]>;
    allTags: string[] = ['Sea View', 'Balcony', 'Corner Room', 'Vegan', 'Gluten Free', 'Newspaper', 'Ironing Board'];
    
    selectedCategory: string = 'Room Features';

    constructor() {
        this.filteredTags = this.tagCtrl.valueChanges.pipe(
            startWith(null),
            map((tag: string | null) => (tag ? this._filter(tag) : this.allTags.slice())),
        );
    }

    ngOnInit(): void {
    }

    add(event: any, categoryIndex: number): void {
        const value = (event.value || '').trim();
        if (value) {
            this.preferences[categoryIndex].items.push(value);
        }
        event.chipInput!.clear();
        this.tagCtrl.setValue(null);
    }

    remove(item: string, categoryIndex: number): void {
        const index = this.preferences[categoryIndex].items.indexOf(item);
        if (index >= 0) {
            this.preferences[categoryIndex].items.splice(index, 1);
        }
    }

    selected(event: any, categoryIndex: number): void {
        this.preferences[categoryIndex].items.push(event.option.viewValue);
        this.tagCtrl.setValue(null);
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.allTags.filter(tag => tag.toLowerCase().includes(filterValue));
    }

    addRequest(note: string): void {
        if(note.trim()) {
            this.specialRequests.push(note);
        }
    }

    removeRequest(index: number): void {
        this.specialRequests.splice(index, 1);
    }
}
