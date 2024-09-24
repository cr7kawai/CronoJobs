import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  API_URI = 'http://localhost:3000/api/user';

  constructor(private http: HttpClient) { }

  private jwtHelper = new JwtHelperService();

  // No verifica otp se usa en registro y actualización de plan
  inicio_sesion(datos: Usuario) {
    return this.http.post(`${this.API_URI}/inicio_sesion/`, datos);
  }

  // Verifica otp, se usa en login normal
  login(datos: Usuario) {
    return this.http.post(`${this.API_URI}/login/`, datos);
  }
  verifyOtp(email: string, otp: string): Observable<any> {
    return this.http.post(`${this.API_URI}/verify-otp`, { email, otp });
  }

  decodeToken(token: string): any {
    return this.jwtHelper.decodeToken(token);
  }
}