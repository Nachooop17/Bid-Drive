"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mercadopago_1 = require("mercadopago");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Configura tu Access Token de Mercado Pago aquí
const client = new mercadopago_1.MercadoPagoConfig({ accessToken: 'TEST-5795038714450051-062204-02f9373c34461a5ba566574f22cd1ffd-278679942' });
app.post('/crear-pago', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount, title = 'Auto' } = req.body;
        const preference = new mercadopago_1.Preference(client);
        const result = yield preference.create({
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
