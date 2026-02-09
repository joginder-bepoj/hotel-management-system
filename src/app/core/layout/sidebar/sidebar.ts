import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { NgScrollbarModule } from 'ngx-scrollbar';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
  standalone: true,
  imports: [MatListModule, MatIconModule, RouterModule, NgScrollbarModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Sidebar {
  user: any;

  constructor() { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    const body = document.querySelector('body');
    if (body) {
      body.classList.add('ls-closed');
    }
  }

  toggleMenu(event: Event) {
    event.preventDefault();
    const toggle = event.currentTarget as HTMLElement;
    const parentLi = toggle.parentElement;

    if (parentLi) {
      parentLi.classList.toggle('active');
      const subMenu = parentLi.querySelector('.submenu');
      if (subMenu) {
        if (parentLi.classList.contains('active')) {
          (subMenu as HTMLElement).style.display = 'block';
        } else {
          (subMenu as HTMLElement).style.display = 'none';
        }
      }
    }
  }
}
