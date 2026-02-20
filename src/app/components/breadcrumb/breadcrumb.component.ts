import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class BreadcrumbComponent {
  @Input() title!: string;
  @Input() items!: any[];
  @Input() active_item!: string;

  getItemLabel(item: any): string {
    return typeof item === 'string' ? item : item.label;
  }

  getItemLink(item: any): string | null {
    if (typeof item !== 'string') return item.link;
    const label = item.toLowerCase();
    if (label === 'home') return '/dashboard';
    if (label === 'restaurant') return '/restaurant/dashboard';
    return null;
  }
}
