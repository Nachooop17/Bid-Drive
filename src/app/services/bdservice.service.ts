import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment'; // Asumimos que tienes tus credenciales aquí
import { Vehiculo } from '../interfaces/vehiculo';

@Injectable({
  providedIn: 'root'
})
export class BdserviceService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async signUp(email: string, password: string): Promise<{ user: User | null, error: any }> {
    const { data, error } = await this.supabase.auth.signUp({
      email: email,
      password: password,
    });
    return { user: data.user, error };
  }

  async signIn(email: string, password: string): Promise<{ user: User | null, error: any }> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    return { user: data.user, error };
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    return { error };
  }

  async getCurrentUser(): Promise<User | null> { // <--- Hazlo async y que devuelva Promise<User | null>
    const { data: { user } } = await this.supabase.auth.getUser(); // <--- Usa await y desestructura para obtener el usuario
    return user;
  }

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  async getVehiculos(): Promise<{ data: Vehiculo[] | null, error: any }> {
    const { data, error } = await this.supabase
      .from('vehiculos')
      .select('*')
      .order('created_at', { ascending: false }); // Opcional: ordenar por fecha de creación
    return { data, error };
  }
  async getVehiculoById(id: number): Promise<{ data: Vehiculo | null, error: any }> {
    const { data, error } = await this.supabase
      .from('vehiculos')
      .select('*')
      .eq('id', id)
      .single(); // .single() para obtener un solo objeto en lugar de un array
    return { data, error };
  }
}