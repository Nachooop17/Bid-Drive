// filepath: c:\Users\ignac\Documents\GitHub\Autos\bid-drive\src\app\pages\car-detail\car-detail.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router'; // Si usas routerLink o navegación
// ... otras importaciones que necesites (ActivatedRoute, BdserviceService, etc.)

@Component({
  selector: 'app-car-detail',
  templateUrl: './car-detail.page.html',
  styleUrls: ['./car-detail.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule
    // ... otros módulos que importe directamente el componente
  ]
})
export class CarDetailPage implements OnInit {
  // ... tu lógica de componente ...
  constructor() { }
  ngOnInit() { }
}