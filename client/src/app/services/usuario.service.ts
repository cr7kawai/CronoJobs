import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';
import { Notificacion } from '../models/notificacion';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  API_URI = 'http://localhost:3000/api/user';

  constructor(private http: HttpClient) { }

  obtenerUsuarios() {
    return this.http.get(`${this.API_URI}/`);
  }

  obtenerRoles() {
    return this.http.get(`${this.API_URI}/rol/`);
  }

  obtenerAreas() {
    return this.http.get(`${this.API_URI}/area/`);
  }

  verUsuario(id_user: any) {
    return this.http.get(`${this.API_URI}/${id_user}`);
  }

  obtenerUsuario(id_user: any){
    return this.http.get(`${this.API_URI}/obtener/${id_user}`);
  }

  obtenerUsuariosArea(id_area: any) {
    return this.http.get(`${this.API_URI}/area/${id_area}`);
  }

  registrarUsuario(usuario: Usuario) {
    return this.http.post(`${this.API_URI}/`, usuario);
  }

  modificarUsuario(id_user: any, usuarioActualizado: Usuario): Observable<Object> {
    return this.http.put(`${this.API_URI}/${id_user}`, usuarioActualizado);
  }

  eliminarUsuario(id_user: any) {
    return this.http.delete(`${this.API_URI}/${id_user}`);
  }

  cambiarContrasena(id_user: any, email: any, usuarioActualizado: Usuario): Observable<Object> {
    return this.http.put(`${this.API_URI}/password/${id_user}/${email}`,usuarioActualizado);
  }

  enviarNotificacion(notificacion: Notificacion) {
    return this.http.post(`${this.API_URI}/notificacion/`, notificacion);
  }

  obtenerNotificaciones(id_user: any) {
    return this.http.get(`${this.API_URI}/notificacion/${id_user}`);
  }
}