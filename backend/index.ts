import express, { Request, Response } from 'express';
import cors from 'cors';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

const app = express();
app.use(express.json());
app.use(cors());

// Configura tu Access Token de Mercado Pago aquí
const client = new MercadoPagoConfig({ accessToken: 'TEST-5795038714450051-062204-02f9373c34461a5ba566574f22cd1ffd-278679942' });

app.post('/procesar-pago', async (req: Request, res: Response) => {
  try {
    const { token, paymentMethodId, issuerId, email, amount, installments, identification } = req.body;

    const payment = new Payment(client);

    const result = await payment.create({
      body: {
        transaction_amount: Number(amount),
        token,
        description: 'Pago de auto',
        installments: Number(installments),
        payment_method_id: paymentMethodId,
        issuer_id: issuerId,
        payer: {
          email,
          identification: {
            type: identification.type,
            number: identification.number
          }
        }
      }
    });

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor backend escuchando`);
});