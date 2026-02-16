import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.html',
  styleUrls: ['./new-order.scss'],
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent]
})
export class NewOrderComponent {}
