import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-kitchen',
  templateUrl: './kitchen.html',
  styleUrls: ['./kitchen.scss'],
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent]
})
export class KitchenComponent {}
