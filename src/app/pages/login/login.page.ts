import { Component, OnInit } from '@angular/core';
import { BdserviceService } from '../../services/bdservice.service';
import { Router, RouterModule } from '@angular/router'; // Importa RouterModule
import { AlertController, IonicModule } from '@ionic/angular'; // Importa IonicModule
import { FormsModule } from '@angular/forms'; // Importa FormsModule para ngModel
import { CommonModule } from '@angular/common'; // Importa CommonModule

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true, // <--- AÑADIR ESTO
  imports: [
    CommonModule,
    FormsModule, // <--- PARA [(ngModel)]
    IonicModule, // <--- PARA COMPONENTES IONIC
    RouterModule // <--- PARA routerLink Y NAVEGACIÓN
  ]
})
export class LoginPage implements OnInit {

  email = '';
  password = '';

  constructor(
    private bdservice: BdserviceService,
    private router: Router,
    private alertController: AlertController
  ) { }

  ngOnInit() {
  }

  async loginUsuario() {
    if (!this.email || !this.password) {
      this.mostrarAlerta('Error', 'Por favor, ingresa email y contraseña.');
      return;
    }
    try {
      const { user, error } = await this.bdservice.signIn(this.email, this.password);
      if (error) {
        console.error('Error en el inicio de sesión:', error);
        this.mostrarAlerta('Error de Inicio de Sesión', error.message || 'Credenciales incorrectas o error en el servidor.');
        return;
      }
      if (user) {
        console.log('Usuario autenticado:', user);
        this.mostrarAlerta('Inicio de Sesión Exitoso', '¡Bienvenido de nuevo!');
        this.router.navigate(['/home']);
      }
    } catch (error: any) {
      console.error('Error inesperado durante el inicio de sesión:', error);
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