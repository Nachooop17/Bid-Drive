import express, { Request, Response } from 'express';
import cors from 'cors';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const app = express();
app.use(express.json());
app.use(cors());

// Configura tu Access Token de Mercado Pago aquí
const client = new MercadoPagoConfig({ accessToken: 'TEST-5795038714450051-062204-02f9373c34461a5ba566574f22cd1ffd-278679942' });

app.post('/crear-pago', async (req: Request, res: Response) => {
  try {
    const { amount, title = 'Auto' } = req.body;

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            id: 'auto-001',
            title,
            quantity: 1,
            unit_price: Number(amount)
          }
        ]
      }
    });

    res.json({ id: result.id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor backend escuchando`);
});