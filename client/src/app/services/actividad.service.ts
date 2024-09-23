import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Actividad } from '../models/actividad';
import { Comentario } from '../models/comentario';

@Injectable({
  providedIn: 'root'
})
export class ActividadService {

  API_URI = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  obtenerActividades(id_proyecto: any){
    return this.http.get(`${this.API_URI}/actividad/${id_proyecto}`);
  }

  obtenerActividadesEmpleado(id_proyecto: any, id_empleado: any){
    return this.http.get(`${this.API_URI}/actividad/usuario/${id_proyecto}/${id_empleado}`);
  }

  verActividad(id_actividad: any){
    return this.http.get(`${this.API_URI}/actividad/ver/${id_actividad}`);
  }

  obtenerActividad(id_actividad: any){
    return this.http.get(`${this.API_URI}/actividad/obtener/${id_actividad}`);
  }

  registrarActividad(actividad: Actividad) {
    return this.http.post(`${this.API_URI}/actividad/`, actividad);
  }

  modificarActividad(id_actividad: any, actividadActualizada: Actividad): Observable<Object> {
    return this.http.put(`${this.API_URI}/actividad/${id_actividad}`, actividadActualizada);
  }

  eliminarActividad(id_actividad: any) {
    return this.http.delete(`${this.API_URI}/actividad/${id_actividad}`);
  }

  actualizarEstadoActividad(id_actividad: any, estadoActividad: any): Observable<Object> {
    return this.http.put(`${this.API_URI}/actividad/estado/${id_actividad}`,estadoActividad);
  }

  actividadesNoCumplidasEmplProy(id_proyecto: any, id_empleado: any) {
    return this.http.get(`${this.API_URI}/actividad/empl-proy/no_cumplida/${id_proyecto}/${id_empleado}`);
  }

  actividadesCumplidasEmplProy(id_proyecto: any, id_empleado: any) {
    return this.http.get(`${this.API_URI}/actividad/empl-proy/cumplida/${id_proyecto}/${id_empleado}`);
  }

  actividadesNoCumplidasProyecto(id_proyecto: any) {
    return this.http.get(`${this.API_URI}/actividad/proyecto/no_cumplida/${id_proyecto}`);
  }

  actividadesCumplidasProyecto(id_proyecto: any) {
    return this.http.get(`${this.API_URI}/actividad/proyecto/cumplida/${id_proyecto}`);
  }

  actividadesCumplidasEmpleado(id_empleado: any) {
    return this.http.get(`${this.API_URI}/actividad/empleado/cumplida/${id_empleado}`);
  }

  actividadesPendientesProyecto(id_proyecto: any) {
    return this.http.get(`${this.API_URI}/actividad/proyecto/pendiente/${id_proyecto}`);
  }

  actividadesPendientesEmpleado(id_empleado: any) {
    return this.http.get(`${this.API_URI}/actividad/empleado/pendiente/${id_empleado}`);
  }

  actividadesRetrasadasProyecto(id_proyecto: any) {
    return this.http.get(`${this.API_URI}/actividad/proyecto/retrasada/${id_proyecto}`);
  }

  actividadesRetrasadasEmpleado(id_empleado: any) {
    return this.http.get(`${this.API_URI}/actividad/empleado/retrasada/${id_empleado}`);
  }

  obtenerComentariosActividad(id_actividad: any) {
    return this.http.get(`${this.API_URI}/actividad/comentario/${id_actividad}`);
  }
  
  registrarComentarioActividad(comentario: Comentario) {
    return this.http.post(`${this.API_URI}/actividad/comentario/`,comentario);
  }
}
