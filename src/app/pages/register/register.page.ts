import { Component, OnInit } from '@angular/core';
import { BdserviceService } from '../../services/bdservice.service';
import { Router, RouterModule } from '@angular/router'; // Importa RouterModule
import { AlertController, IonicModule } from '@ionic/angular'; // Importa IonicModule
import { FormsModule } from '@angular/forms'; // Importa FormsModule para ngModel
import { CommonModule } from '@angular/common'; // Importa CommonModule

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true, // <--- AÑADIR ESTO
  imports: [
    CommonModule,
    FormsModule, // <--- PARA [(ngModel)]
    IonicModule, // <--- PARA COMPONENTES IONIC
    RouterModule // <--- PARA routerLink Y NAVEGACIÓN
  ]
})
export class RegisterPage implements OnInit {

  // Asumimos que tendrás estos campos en tu formulario HTML
  email = '';
  password = '';

  constructor(
    private bdservice: BdserviceService,
    private router: Router,
    private alertController: AlertController
  ) { }

  ngOnInit() {
  }

  async registrarUsuario() {
    if (!this.email || !this.password) {
      this.mostrarAlerta('Error', 'Por favor, ingresa email y contraseña.');
      return;
    }
    try {
      const { user, error } = await this.bdservice.signUp(this.email, this.password);
      if (error) {
        console.error('Error en el registro:', error);
        this.mostrarAlerta('Error de Registro', error.message || 'Ocurrió un error al intentar registrar.');
        return;
      }
      if (user) {
        console.log('Usuario registrado:', user);
        this.mostrarAlerta('Registro Exitoso', '¡Te has registrado correctamente! Revisa tu email para confirmar tu cuenta si es necesario.');
        this.router.navigate(['/login']);
      }
    } catch (error: any) {
      console.error('Error inesperado durante el registro:', error);
      this.mostrarAlerta('Error', 'Ocurrió un error inesperado.');
    }
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }
}