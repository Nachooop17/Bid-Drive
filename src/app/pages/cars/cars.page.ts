import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular'; // Añadir LoadingController y ToastController
import { RouterModule } from '@angular/router';
import { BdserviceService } from '../../services/bdservice.service'; // Importar el servicio
import { Vehiculo } from '../../interfaces/vehiculo';

@Component({
  selector: 'app-cars',
  templateUrl: './cars.page.html',
  styleUrls: ['./cars.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    RouterModule
  ]
})
export class CarsPage implements OnInit {
  vehiculos: Vehiculo[] = [];
  isLoading = false;

  constructor(
    private bdservice: BdserviceService,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.cargarVehiculos();
  }

  async cargarVehiculos(event?: any) {
    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Cargando vehículos...',
    });
    await loading.present();

    const { data, error } = await this.bdservice.getVehiculos();

    await loading.dismiss();
    this.isLoading = false;

    if (error) {
      console.error('Error cargando vehículos:', error);
      this.mostrarToast('Error al cargar los vehículos.', 'danger');
    } else {
      this.vehiculos = data || [];
    }

    if (event) {
      event.target.complete(); // Para el refresher
    }
  }

  // Helper para obtener la primera imagen o un placeholder
  getPrimeraImagen(imagenes: string[]): string {
    if (imagenes && imagenes.length > 0 && imagenes[0]) {
      return imagenes[0];
    }
    return 'https://ionicframework.com/docs/img/demos/card-media.png'; // URL de imagen placeholder
  }

  async mostrarToast(mensaje: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: color
    });
    toast.present();
  }

  handleRefresh(event: any) {
    this.cargarVehiculos(event);
  }
}