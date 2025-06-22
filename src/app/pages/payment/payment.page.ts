import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular'; // <--- IMPORTA ESTO

declare var window: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
  standalone: true,
  imports: [
    IonicModule // <--- AGREGA ESTO
  ]
})
export class PaymentPage implements OnInit {
  isLoading = false;
  mp: any;

  ngOnInit() {
    // Espera a que el script de Mercado Pago esté cargado
    if (window.MercadoPago) {
      this.initMercadoPago();
    } else {
      const interval = setInterval(() => {
        if (window.MercadoPago) {
          clearInterval(interval);
          this.initMercadoPago();
        }
      }, 100);
    }
  }

  initMercadoPago() {
    this.mp = new window.MercadoPago('TEST-8147ef43-104b-4932-a8b4-3ae470c1dd36'); // Reemplaza con tu Public Key
    this.mp.bricks().create('payment', 'paymentBrick_container', {
      initialization: {
        amount: 1000, // Monto a cobrar (ejemplo)
      },
      callbacks: {
        onReady: () => {},
        onSubmit: (formData: any) => {
          // Aquí deberías llamar a tu backend para crear el pago y retornar el resultado
          // Por ejemplo, puedes usar fetch o HttpClient para llamar a tu API
          // Retorna una promesa
          return fetch('https://bid-drive.onrender.com/crear-pago', {
          method: 'POST',
          body: JSON.stringify({ amount: 1000, title: 'Auto' }),
          headers: { 'Content-Type': 'application/json' }
        })
.then(res => res.json());
        },
        onError: (error: any) => {
          console.error(error);
        }
      }
    });
  }

}