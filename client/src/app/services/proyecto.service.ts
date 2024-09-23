import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Proyecto } from '../models/proyecto';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {

  API_URI = 'http://localhost:3000/api/proyecto';

  constructor(private http: HttpClient) { }

  obtenerProyectos() {
    return this.http.get(`${this.API_URI}/`);
  }

  verProyecto(id_proyecto: any) {
    return this.http.get(`${this.API_URI}/${id_proyecto}`);
  }

  obtenerProyecto(id_proyecto: any) {
    return this.http.get(`${this.API_URI}/obtener/${id_proyecto}`);
  }

  obtenerProyectosArea(id_area: any) {
    return this.http.get(`${this.API_URI}/area/${id_area}`);
  }

  registrarProyecto(proyecto: Proyecto) {
    return this.http.post(`${this.API_URI}/`,proyecto);
  }

  modificarProyecto(id_proyecto: any, proyectoActualizado: Proyecto): Observable<Object> {
    return this.http.put(`${this.API_URI}/${id_proyecto}`, proyectoActualizado);
  }

  modificarEstadoProyecto(id_proyecto: any, proyectoActualizado: Proyecto): Observable<Object> {
    return this.http.put(`${this.API_URI}/estado/${id_proyecto}`, proyectoActualizado);
  }

  eliminarProyecto(id_proyecto: any) {
    return this.http.delete(`${this.API_URI}/${id_proyecto}`);
  }
}