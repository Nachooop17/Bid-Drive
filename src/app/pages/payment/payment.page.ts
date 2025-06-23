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
  realizarPago(): Promise<string> {
  return Promise.resolve('ok');
}

  initMercadoPago() {
    this.mp = new window.MercadoPago('TEST-8147ef43-104b-4932-a8b4-3ae470c1dd36', {
      locale: 'es-CL'
    });

    this.mp.bricks().create('payment', 'paymentBrick_container', {
      initialization: {
        amount: 1000,
      },
      customization: {
        paymentMethods: {
          creditCard: ['amex', 'master', 'visa'],
          debitCard: ['visa', 'master'],
          ticket: [],
          atm: []
        }
      },
      callbacks: {
        onReady: () => {
          // El Brick está listo
        },
        onSubmit: async (formData: any) => {
          try {
            // Log para depuración
            console.log('Datos recibidos del Brick:', JSON.stringify(formData, null, 2));
            alert('Datos recibidos del Brick:\n' + JSON.stringify(formData, null, 2));

            // Extrae los datos reales
            const data = formData.formData;

            // Validación robusta
            const missingFields: string[] = [];
            if (!data.token) missingFields.push('token');
            if (!data.payment_method_id) missingFields.push('payment_method_id');
            if (!data.issuer_id) missingFields.push('issuer_id');
            if (!data.payer?.email) missingFields.push('payer.email');
            if (!data.transaction_amount) missingFields.push('transaction_amount');
            if (!data.installments) missingFields.push('installments');
            if (!data.payer?.identification?.type) missingFields.push('payer.identification.type');
            if (!data.payer?.identification?.number) missingFields.push('payer.identification.number');

            if (missingFields.length > 0) {
              alert('Faltan los siguientes datos requeridos para procesar el pago:\n' + missingFields.join('\n') +
                '\n\nRevisa la consola para ver los datos recibidos.');
              return Promise.reject({
                type: 'critical',
                cause: 'validation_error',
                message: 'Faltan datos requeridos para procesar el pago.'
              });
            }

            // Log de los datos que se enviarán
            console.log('Enviando datos al backend:', {
              token: data.token,
              paymentMethodId: data.payment_method_id,
              issuerId: data.issuer_id,
              email: data.payer.email,
              amount: data.transaction_amount,
              installments: data.installments,
              identification: data.payer.identification
            });

            const res = await fetch('https://bid-drive.onrender.com/crear-pago', {
              method: 'POST',
              body: JSON.stringify({
                token: data.token,
                paymentMethodId: data.payment_method_id,
                issuerId: data.issuer_id,
                email: data.payer.email,
                amount: data.transaction_amount,
                installments: data.installments,
                identification: data.payer.identification
              }),
              headers: { 'Content-Type': 'application/json' }
            });

            if (!res.ok) {
              const errorText = await res.text();
              console.error('Error de red o backend:', errorText);
              alert('Error al conectar con el backend: ' + errorText);
              return Promise.reject({
                type: 'critical',
                cause: 'backend_error',
                message: 'Error al conectar con el backend.'
              });
            }

            const result = await res.json();

            if (result.status === 'approved' || result.status === 'accredited') {
              alert('¡Pago realizado con éxito!');
            } else {
              alert('El pago no fue aprobado: ' + (result.status_detail || 'Verifica los datos e intenta de nuevo.'));
            }

            return result;
          } catch (error) {
            console.error('Error en onSubmit:', error);
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