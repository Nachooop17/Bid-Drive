import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

declare var window: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
  standalone: true,
  imports: [
    IonicModule
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
    this.mp = new window.MercadoPago('TEST-8147ef43-104b-4932-a8b4-3ae470c1dd36', {
      locale: 'es-CL'
    });

    this.mp.bricks().create('payment', 'paymentBrick_container', {
      initialization: {
        amount: 1000,
        // Puedes agregar payer o preferenceId si tu backend lo retorna
      },
      customization: {
        paymentMethods: {
          creditCard: ['amex', 'master', 'visa'], // Métodos válidos
          debitCard: ['visa', 'master'],
          ticket: [], // Si no usas, déjalo vacío
          atm: []    // Si no usas, déjalo vacío
        }
      },
      callbacks: {
        onReady: () => {
          // El Brick está listo
        },
          onSubmit: async (formData: any) => {
          try {
            // Envía solo los datos necesarios al backend para crear el pago con la API de Mercado Pago
            const res = await fetch('https://bid-drive.onrender.com/crear-pago', {
              method: 'POST',
              body: JSON.stringify({
                token: formData.token,
                paymentMethodId: formData.paymentMethodId,
                issuerId: formData.issuerId,
                email: formData.payer.email,
                amount: formData.amount,
                installments: formData.installments,
                identification: formData.payer.identification
              }),
              headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();

            // Verifica el estado del pago
            if (data.status === 'approved' || data.status === 'accredited') {
              alert('¡Pago realizado con éxito!');
              // Aquí puedes redirigir o mostrar un comprobante
            } else {
              alert('El pago no fue aprobado: ' + (data.status_detail || 'Verifica los datos e intenta de nuevo.'));
            }

            // Mercado Pago espera que retornes el resultado para cerrar el Brick
            return data;
          } catch (error) {
            alert('Ocurrió un error al procesar el pago.');
            return Promise.reject({
              type: 'critical',
              cause: 'backend_error',
              message: 'Ocurrió un error al procesar el pago. Intenta nuevamente.'
            });
          }
        },
        onError: (error: any) => {
          // Muestra el error en consola y podrías mostrarlo al usuario
          console.error('MercadoPago Brick error:', error);
        }
      }
    });
  }
}