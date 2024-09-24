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

  obtenerUsuarios(id_empresa: any) {
    return this.http.get(`${this.API_URI}/empresa/${id_empresa}`);
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

  obtenerCredenciales(id_user: any){
    return this.http.get(`${this.API_URI}/credenciales/${id_user}`);
  }

  obtenerUsuariosArea(id_area: any, id_empresa: any) {
    return this.http.get(`${this.API_URI}/area/${id_area}/${id_empresa}`);
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

  enviarEmailConfirmacion(email:any){
    return this.http.get(`${this.API_URI}/password/${email}`);
  }

  obtenerUsuarioEmail(email:any){
    return this.http.get(`${this.API_URI}/obtener/email/${email}`);
  }

  enviarNotificacion(notificacion: Notificacion) {
    return this.http.post(`${this.API_URI}/notificacion/`, notificacion);
  }

  obtenerNotificaciones(id_user: any) {
    return this.http.get(`${this.API_URI}/notificacion/${id_user}`);
  }

  validarEmailTel(usuario: Usuario) {
    return this.http.post(`${this.API_URI}/validarEmailTel`, usuario);
  }
}