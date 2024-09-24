import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css']
})
export class NotificacionesComponent implements OnInit{
  
  notificaciones: any = [];

  // Datos de la sesión
  datoSesion: any = [];
  datoSesionObject: any = [];
  pk_usuario: any = null;

  constructor(
    private activatedRoute: ActivatedRoute, 
    private usuarioService: UsuarioService,
    private router: Router,
    private authService: AuthService
  ){}

  ngOnInit(): void {
     // Validar si el usuario ha iniciado sesión
     this.datoSesion = this.authService.getUserData();

    if (this.datoSesion) {
      this.pk_usuario = this.datoSesion.pk_usuario || null;
    }else{
      this.router.navigate(['/403']);
      return;
    }

    this.obtenerNotificaciones()
  }

  obtenerNotificaciones(){
    this.usuarioService.obtenerNotificaciones(this.pk_usuario).subscribe(res =>{
      this.notificaciones = res;
      console.log(this.notificaciones)
    },err => console.log(err))
  }

}
