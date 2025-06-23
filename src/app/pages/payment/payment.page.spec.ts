import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentPage } from './payment.page';

describe('PaymentPage', () => {
  let component: PaymentPage;
  let fixture: ComponentFixture<PaymentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería ejecutar varias compras a la vez (simulado)', async () => {
    // Simula un método de pago que retorna una promesa resuelta
    spyOn(component as any, 'realizarPago').and.callFake(() => Promise.resolve('ok'));

    // Ejecuta 5 compras simultáneas
    const compras = Array(5).fill(null).map(() => (component as any).realizarPago());
    const resultados = await Promise.all(compras);

    expect(resultados.length).toBe(5);
    expect(resultados.every(r => r === 'ok')).toBeTrue();
  });
});