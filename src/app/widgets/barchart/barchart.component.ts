import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
    selector: 'app-barchart',
    templateUrl: './barchart.component.html',
    styleUrl: './barchart.component.css',
    standalone: true
})
export class BarchartComponent implements OnInit{
  @ViewChild('canvas', {static: true}) canvasRef!: ElementRef;
  chart: any;

  constructor(private renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.chart = new Chart(this.canvasRef.nativeElement, {
      type: 'bar',
      data: {
        labels: ["Arusha", "Babati", "Bahi", "Bariadi", "Biharamulo", "Bukoba", "Bukombe",
          "Bunda", "Chamwino", "Chato", "Chunya", "Dodoma", "Geita", "Hanang", "Handeni",
          "Igunga", "Ikungi", "Ilemela", "Iramba", "Iringa", "Kahama", "Kakonko", "Kalambo",
          "Kaliua", "Kasulu", "Kibaha", "Kigoma", "Kilindi", "Kilolo", "Kilombero", "Kilosa",
          "Kilwa", "Kinga", "Kishapu", "Kiteto", "Kondoa", "Kongwa", "Korogwe", "Kyela", "Lindi",
          "Liwale", "Longido", "Ludewa", "Lushoto", "Mafia", "Magu", "Makete", "Manyoni", "Masasi",
          "Maswa", "Mbeya", "Mbinga", "Mbogwe", "Mbozi", "Mbulu", "Meatu", "Misenyi", "Misungwi",
          "Mkinga", "Monduli", "Morogoro", "Mpanda", "Mpwapwa", "Msalala", "Muheza", "Muleba",
          "Musoma", "Mvomero", "Mwanga", "Mwansambo", "Nachingwea", "Namtumbo", "Nanyumbu", "Newala",
          "Ngara", "Ngorongoro", "Njombe", "Nkasi", "Nzega", "Pangani", "Rombo"],
        datasets: [
          {
            label: 'Registrations by council',
            data: [7, 127834, 72255, 190460, 40259, 212573, 100123, 156920, 287346, 124780,
              159430, 410956, 104934, 101983, 176747, 134982, 199789, 129609, 142544, 339160,
              243841, 103545, 38295, 70064, 287833, 274749, 215458, 282673, 183573, 385176,
              419298, 78102, 90120, 141808, 114673, 221795, 228860, 265888, 207396, 210706,
              48997, 69517, 126570, 234084, 46428, 258461, 102084, 257895, 222431, 192973,
              385279, 305930, 90282, 379334, 334983, 225367, 75140, 172682, 90082, 189306,
              349970, 147821, 127810, 92400, 208886, 215973, 182464, 293299, 181613, 126357,
              161070, 166239, 113070, 87540, 159324, 229774, 273917, 211528, 180541, 45696,
              121207],
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
