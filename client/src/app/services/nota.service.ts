import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Nota } from '../models/nota';

@Injectable({
  providedIn: 'root'
})
export class NotaService {

  API_URI = 'http://localhost:3000/api/nota';

  constructor(private http: HttpClient) { }

  obtenerNotas(id_proyecto: any) {
    return this.http.get(`${this.API_URI}/${id_proyecto}`);
  }

  registrarNota(nota: Nota) {
    return this.http.post(`${this.API_URI}/`,nota);
  }

  modificarNota(id_nota: any, notaActualizada: Nota): Observable<Object> {
    return this.http.put(`${this.API_URI}/${id_nota}`, notaActualizada);
  }

  eliminarNota(id_nota: any) {
    return this.http.delete(`${this.API_URI}/${id_nota}`);
  }
}