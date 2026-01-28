import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class BreadcrumbComponent {
  @Input() title!: string;
  @Input() items!: string[];
  @Input() active_item!: string;
}
