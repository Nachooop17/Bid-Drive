// O el archivo donde tengas tus rutas principales, por ejemplo app.routes.ts
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login', // O la página que quieras como inicial
    pathMatch: 'full'
  },
  // ... otras rutas ...
  {
    path: 'login',
    // AHORA: se carga directamente el componente standalone
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register',
    // AHORA: se carga directamente el componente standalone
    loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'cars',
    // AHORA: se carga directamente el componente standalone
    loadComponent: () => import('./pages/cars/cars.page').then( m => m.CarsPage)
    },
    {
    path: 'vehiculo-detalle/:id', // Ruta para los detalles del vehículo
    loadComponent: () => import('./pages/car-detail/car-detail.page').then(m => m.CarDetailPage)
   },
  {
    path: 'payment',
    loadChildren: () => import('./pages/payment/payment.module').then( m => m.PaymentPageModule)
  }
  // ... más rutas si las tienes
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }