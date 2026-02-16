import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.html',
  styleUrls: ['./bills.scss'],
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent]
})
export class BillsComponent {}
