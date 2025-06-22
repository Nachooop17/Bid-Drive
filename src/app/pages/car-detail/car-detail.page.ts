import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; // Importa CUSTOM_ELEMENTS_SCHEMA
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, LoadingController, NavController, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BdserviceService } from '../../services/bdservice.service';
import { Vehiculo } from '../../interfaces/vehiculo';
// No es necesario importar 'register' de swiper si usas CUSTOM_ELEMENTS_SCHEMA para los elementos de Swiper

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
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Añade esto para permitir elementos personalizados como los de Swiper
})
export class CarDetailPage implements OnInit {
  vehiculo: Vehiculo | null = null;
  isLoading = false;
  vehiculoId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bdservice: BdserviceService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private navController: NavController
  ) { }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.vehiculoId = +idParam;
      this.cargarDetallesVehiculo();
    } else {
      console.error('No se encontró el ID del vehículo en la ruta');
      this.mostrarToast('Error: No se pudo cargar el vehículo.', 'danger');
      this.navController.back();
    }
  }

  async cargarDetallesVehiculo() {
    if (!this.vehiculoId) return;

    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Cargando detalles...',
    });
    await loading.present();

    const { data, error } = await this.bdservice.getVehiculoById(this.vehiculoId);

    await loading.dismiss();
    this.isLoading = false;

    if (error) {
      console.error('Error cargando detalles del vehículo:', error);
      this.mostrarToast('Error al cargar los detalles del vehículo.', 'danger');
      this.navController.back();
    } else if (data) {
      this.vehiculo = data;
    } else {
      this.mostrarToast('Vehículo no encontrado.', 'warning');
      this.navController.back();
    }
  }

  pagarVehiculo() {
  // Aquí puedes navegar a la página de pago y pasar el id o los datos del auto
  this.router.navigate(['/payment'], { queryParams: { id: this.vehiculo?.id } });
}

  getPrimeraImagen(imagenes: string[] | undefined): string {
    if (imagenes && imagenes.length > 0 && imagenes[0]) {
      return imagenes[0];
    }
    return 'https://ionicframework.com/docs/img/demos/card-media.png';
  }

  async mostrarToast(mensaje: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: color
    });
    toast.present();
  }

  goBack() {
    this.navController.back();
  }
}