import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrl: './barchart.component.css',
  standalone: true
})
export class BarchartComponent implements OnInit {
  @ViewChild('canvas', {static: true}) canvasRef!: ElementRef;
  chart: any;

  constructor(private renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.chart = new Chart(this.canvasRef.nativeElement, {
      type: 'bar',
      data: {
        labels: ["Chake Chake",
          "Micheweni",
          "Mkoani",
          "Wete",
          "Kaskazini A",
          "Kaskazini B",
          "Kati",
          "Kusini",
          "Magharibi A",
          "Magharibi B",
          "Mjini"],
        datasets: [
          {
            label: 'Registrations by council',
            data: [342, 765, 981, 453, 874, 291, 698, 123, 567, 345,
              432, 876, 234, 678, 980, 456, 789, 321, 654, 987,
              213, 654, 876],
            backgroundColor: 'rgba(3,241,241,0.82)',
            borderColor: 'rgb(85,127,213)',
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    // Set canvas dimensions to match parent container
    this.setCanvasDimensions();
  }

  private setCanvasDimensions(): void {
    const canvas = this.canvasRef.nativeElement;
    const parent = canvas.parentElement;

    // Set canvas width and height to match parent's computed width and height
    this.renderer.setStyle(canvas, 'width', `${parent.clientWidth}px`);
    this.renderer.setStyle(canvas, 'height', `${parent.clientHeight}px`);

    // Update the chart to reflect the new dimensions
    this.chart.resize();
  }

}
