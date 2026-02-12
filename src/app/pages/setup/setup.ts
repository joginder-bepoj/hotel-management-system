import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { TypedHeader } from '../../components/typed-header/typed-header';
import { ParticleBackgroundComponent } from '../../components/particle-background/particle-background';

@Component({
  selector: 'app-setup',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, RouterModule, TypedHeader, ParticleBackgroundComponent],
  templateUrl: './setup.html',
  styleUrls: ['./setup.scss']
})
export class SetupComponent {
  @ViewChild('setupVideo') setupVideo!: ElementRef<HTMLVideoElement>;

  constructor(private router: Router) {}

  ngAfterViewInit() {
    if (this.setupVideo) {
      this.setupVideo.nativeElement.play().catch((err: any) => {
        console.warn('Video autoplay failed, will try again on interaction:', err);
      });
    }
  }

  onVideoError(event: any) {
    console.error('Video error details:', event);
    const video = event.target as HTMLVideoElement;
    console.error('Video src:', video.currentSrc);
    console.error('Video error object:', video.error);
  }

  selectOption(option: string) {
    console.log('selectOption called with:', option);
    switch(option) {
      case 'hotel':
        console.log('Navigating to /setup/hotel');
        this.router.navigate(['/setup/hotel']).then(success => {
          console.log('Navigation result:', success);
        }).catch(err => {
          console.error('Navigation error:', err);
        });
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
