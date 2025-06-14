import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment'; // Asumimos que tienes tus credenciales aquí

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
}