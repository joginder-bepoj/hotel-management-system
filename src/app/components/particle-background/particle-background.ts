import { Component, ElementRef, HostListener, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

@Component({
  selector: 'app-landing-particles',
  standalone: true,
  imports: [CommonModule],
  template: `<canvas #canvas></canvas>`,
  styles: [`
    :host {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      z-index: -1;
      pointer-events: none;
    }
    canvas {
      display: block;
      width: 100%;
      height: 100%;
    }
  `]
})
export class ParticleBackgroundComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animationId: number = 0;
  private resizeObserver!: ResizeObserver;

  // Configuration
  private readonly particleCount = 80;
  private readonly connectionDistance = 150;
  private readonly mouseDistance = 200;

  private mouseX = -1000;
  private mouseY = -1000;

  constructor(private ngZone: NgZone) {}

  ngOnInit() {
    // Run outside Angular to prevent excessive change detection cycles
    this.ngZone.runOutsideAngular(() => {
      this.initCanvas();
      this.animate();
    });
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId);
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  private initCanvas() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    
    // Handle resizing
    this.resizeObserver = new ResizeObserver(() => {
      this.resize();
    });
    this.resizeObserver.observe(canvas.parentElement || document.body);
    
    this.resize();
    this.createParticles();
    
    // Mouse interaction
    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
    });
  }

  private resize() {
    const canvas = this.canvasRef.nativeElement;
    const parent = canvas.parentElement || document.body;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    
    // Re-create particles on drastic resize or just let them be? 
    // Let's keep them but ensure they are within bounds or respawn
    if (this.particles.length === 0) {
      this.createParticles();
    }
  }

  private createParticles() {
    this.particles = [];
    const canvas = this.canvasRef.nativeElement;
    
    for (let i = 0; i < this.particleCount; i++) {
        this.particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 1, // Velocity X
            vy: (Math.random() - 0.5) * 1, // Velocity Y
            size: Math.random() * 2 + 1
        });
    }
  }

  private animate() {
    this.draw();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  private draw() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = this.ctx;
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    
    // Update and draw particles
    for (let i = 0; i < this.particles.length; i++) {
      let p = this.particles[i];
      
      // Move
      p.x += p.vx;
      p.y += p.vy;
      
      // Bounce off edges
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
      
      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(63, 81, 181, 0.5)'; // Primary color with opacity
      ctx.fill();
      
      // Connections
      for (let j = i; j < this.particles.length; j++) {
        let p2 = this.particles[j];
        let dx = p.x - p2.x;
        let dy = p.y - p2.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < this.connectionDistance) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(63, 81, 181, ${0.2 * (1 - dist / this.connectionDistance)})`;
          ctx.lineWidth = 1;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
      
      // Mouse interaction (connect to mouse)
      let dx = p.x - this.mouseX;
      let dy = p.y - this.mouseY;
      let dist = Math.sqrt(dx*dx + dy*dy);
      
      if (dist < this.mouseDistance) {
         ctx.beginPath();
          ctx.strokeStyle = `rgba(63, 81, 181, ${0.4 * (1 - dist / this.mouseDistance)})`;
          ctx.lineWidth = 1;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(this.mouseX, this.mouseY);
          ctx.stroke();
      }
    }
  }
}
