import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css']
})
export class NotificacionesComponent implements OnInit{
  
  notificaciones: any = [];

  datoSesion: any = [];
  datoSesionObject: any = [];
  pk_usuario: any = null;

  constructor(private activatedRoute: ActivatedRoute, private usuarioService: UsuarioService, private router: Router){}

  ngOnInit(): void {
    // Validar si el usuario ha iniciado sesión
    this.datoSesion = sessionStorage.getItem('userData');
    this.datoSesionObject = JSON.parse(this.datoSesion);

    if (this.datoSesionObject) {
      this.pk_usuario = this.datoSesionObject.pk_usuario || null;
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
