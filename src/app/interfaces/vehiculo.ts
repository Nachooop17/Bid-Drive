export interface Vehiculo {
  id: number;
  created_at: string;
  marca: string;
  modelo: string;
  ano: number;
  precio_clp: number;
  kilometraje: number;
  combustible: string;
  transmision: string;
  descripcion: string;
  imagenes: string[]; // Asumiendo que 'imagenes' es un array de URLs
  vendido: boolean;
}