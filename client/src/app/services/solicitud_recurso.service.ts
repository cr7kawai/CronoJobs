import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Nota } from '../models/nota';
import { Solicitud_Recursos } from '../models/solicitud_recursos';

@Injectable({
  providedIn: 'root'
})
export class SolicitudRecursoService {

  API_URI = 'http://localhost:3000/api/recurso';

  constructor(private http: HttpClient) { }

  obtenersolicitudes(id_proyecto: any) {
    return this.http.get(`${this.API_URI}/${id_proyecto}`);
  }

  registrarSolicitudRecurso(recurso: Solicitud_Recursos) {
    return this.http.post(`${this.API_URI}/`,recurso);
  }

  obtenerSolicitud(id_solicitud: any){
    return this.http.get(`${this.API_URI}/obtener/${id_solicitud}`);
  }

  ActualizarSolicitud(id_solicitud: any, solicitudActualizada: Solicitud_Recursos): Observable<Object>{
    return this.http.put(`${this.API_URI}/${id_solicitud}`,solicitudActualizada);
  }

  eliminarSolicitud(id_solicitud: any) {
    return this.http.delete(`${this.API_URI}/${id_solicitud}`);
  }
}