
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-setup',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, RouterModule],
  templateUrl: './setup.html',
  styleUrls: ['./setup.scss']
})
export class SetupComponent {

  constructor(private router: Router) {}

  selectOption(option: string) {
    switch(option) {
      case 'hotel':
        this.router.navigate(['/setup/hotel']);
        break;
      case 'restaurant':
        this.router.navigate(['/setup/restaurant']);
        break;
      case 'apartment':
        this.router.navigate(['/setup/apartment']);
        break;
    }
  }
}
