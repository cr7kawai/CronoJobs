import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EquipoArea } from '../models/equipo-area';

@Injectable({
  providedIn: 'root'
})
export class EquipoAreaService {

  API_URI = 'http://localhost:3000/api/area';

  constructor(private http: HttpClient) { }

  obtenerAreas(id_empresa: any) {
    return this.http.get(`${this.API_URI}/${id_empresa}`);
  }

  verArea(id_area: any) {
    return this.http.get(`${this.API_URI}/verUna/${id_area}`);
  }

  registrarArea(equipoArea: EquipoArea) {
    return this.http.post(`${this.API_URI}/`,equipoArea);
  }

  modificarArea(id_area: any, areaActualizada: EquipoArea): Observable<Object> {
    return this.http.put(`${this.API_URI}/${id_area}`, areaActualizada);
  }

  eliminarArea(id_area: any) {
    return this.http.delete(`${this.API_URI}/${id_area}`);
  }
}