import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router'; // Si usas routerLink o directivas de enrutamiento en la plantilla

@Component({
  selector: 'app-cars',
  templateUrl: './cars.page.html',
  styleUrls: ['./cars.page.scss'],
  standalone: true, // <--- AÑADIR ESTO
  imports: [
    CommonModule,
    IonicModule,
    RouterModule // <--- AÑADIR MÓDULOS NECESARIOS
  ]
})
export class CarsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}