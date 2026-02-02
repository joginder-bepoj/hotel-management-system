import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-typed-header',
  imports: [CommonModule],
  templateUrl: './typed-header.html',
  styleUrl: './typed-header.scss',
})
export class TypedHeader implements AfterViewInit {
 @Input() text = '';
  @Input() typingSpeed = 60; // ms per character

  letters: string[] = [];
  visibleCount = 0;

  @ViewChild('cursor', { static: false }) cursor!: ElementRef;

  ngAfterViewInit() {
    this.letters = this.text.split('');
    this.typeNext();
  }

  typeNext() {
    if (this.visibleCount < this.letters.length) {
      this.visibleCount++;

      // move cursor after rendering
      requestAnimationFrame(() => this.moveCursor());

      setTimeout(() => this.typeNext(), this.typingSpeed);
    }
  }

  moveCursor() {
    const lastLetter = document.querySelector(
      `.typed-letter:nth-child(${this.visibleCount})`
    ) as HTMLElement;

    if (lastLetter && this.cursor) {
      const rect = lastLetter.getBoundingClientRect();
      const parentRect = lastLetter.parentElement!.getBoundingClientRect();

      this.cursor.nativeElement.style.left =
        rect.right - parentRect.left + 'px';
      this.cursor.nativeElement.style.top =
        rect.top - parentRect.top + 'px';
    }
  }
}
