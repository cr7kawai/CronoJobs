import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  API_URI = 'http://localhost:3000/api/user';

  constructor(private http: HttpClient) { }

  login(datos: Usuario) {
    return this.http.post(`${this.API_URI}/login/`, datos);
  }
}