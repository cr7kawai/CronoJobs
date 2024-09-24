import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit{

  datosUsuario: any;
  usuario: any = null;
  rol: any = null;
  plan: any = null;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.datosUsuario = this.authService.getUserData();
    if (this.datosUsuario) {
      this.usuario = this.datosUsuario.nombre;
      this.rol = this.datosUsuario.fk_rol;
      this.plan = this.datosUsuario.fk_suscripcion;
    }
  }

  cerrarSesion(){
    localStorage.removeItem('token');
    window.location.href = '/';
  }
}
