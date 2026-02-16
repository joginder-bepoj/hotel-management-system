import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.html',
  styleUrls: ['./tables.scss'],
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent]
})
export class TablesComponent {}
