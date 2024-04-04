import { Component } from '@angular/core';
import { RectangleDimensions } from '../../utility/utils';
import { RectangleService } from '../../service/rectangle.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'rectangle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rectangle.component.html',
  styleUrl: './rectangle.component.css',
})
export class RectangleComponent {
  rectangle: RectangleDimensions = {
    x: 50,
    y: 50,
    width: 50,
    height: 100,
  };
  isResizing = false;
  initialMouseX = 0;
  initialMouseY = 0;
  resizeHandle: string = '';
  perimeter: number = 0;
  subscription: Subscription | undefined;

  constructor(private rectangleService: RectangleService) {}

  ngOnInit(): void {
    this.getRectangleDimensions();
    this.calculatePerimeter();
  }

  getRectangleDimensions(): void {
    this.subscription = this.rectangleService
      .getRectangleDimensions()
      .subscribe((dimensions) => {
        this.rectangle = dimensions;
        this.calculatePerimeter();
      });
  }

  calculatePerimeter(): void {
    this.perimeter = 2 * (this.rectangle.width + this.rectangle.height);
  }

  onMouseDown(event: MouseEvent) {
    this.isResizing = true;
    this.initialMouseX = event.clientX;
    this.initialMouseY = event.clientY;
  }

  onMouseUp() {
    if (this.isResizing) this.updateRectangleDimensions();

    this.isResizing = false;
  }

  onMouseMove(event: MouseEvent) {
    if (this.isResizing) {
      const dx = event.clientX - this.initialMouseX;
      const dy = event.clientY - this.initialMouseY;

      const horizontalResize =
        this.resizeHandle.includes('left') ||
        this.resizeHandle.includes('right');
      const verticalResize =
        this.resizeHandle.includes('top') ||
        this.resizeHandle.includes('bottom');

      if (horizontalResize) {
        if (
          this.resizeHandle.includes('left') &&
          this.rectangle.width - dx >= 0
        ) {
          this.rectangle.x += dx;
          this.rectangle.width -= dx;
        } else if (
          this.resizeHandle.includes('right') &&
          this.rectangle.width + dx >= 0
        ) {
          this.rectangle.width += dx;
        }
      }

      if (verticalResize) {
        if (
          this.resizeHandle.includes('top') &&
          this.rectangle.height - dy >= 0
        ) {
          this.rectangle.y += dy;
          this.rectangle.height -= dy;
        } else if (
          this.resizeHandle.includes('bottom') &&
          this.rectangle.height + dy >= 0
        ) {
          this.rectangle.height += dy;
        }
      }

      this.calculatePerimeter();
      this.initialMouseX = event.clientX;
      this.initialMouseY = event.clientY;
    }
  }

  onDotMouseDown(event: MouseEvent, handle: string) {
    this.isResizing = true;
    this.initialMouseX = event.clientX;
    this.initialMouseY = event.clientY;
    this.resizeHandle = handle;
  }

  updateRectangleDimensions() {
    this.subscription?.unsubscribe();
    this.rectangleService.updateRectangleDimensions(this.rectangle).subscribe(
      () => {
        console.log('Rectangle dimensions updated successfully.');
      },
      (error) => {
        console.error('Error updating rectangle dimensions:', error);
      }
    );
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
