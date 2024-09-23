import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit{

  datoSesion: any = sessionStorage.getItem('userData');
  datoSesionObject: any;
  usuario: any = null;
  rol: any = null;

  ngOnInit(): void {
    if (this.datoSesion) {
      this.datoSesionObject = JSON.parse(this.datoSesion);
      if (this.datoSesionObject) {
        this.usuario = this.datoSesionObject.nombre;
        this.rol = this.datoSesionObject.fk_rol;
      }
    }
  }

  cerrarSesion(){
    sessionStorage.removeItem('userData');
    window.location.href = '/';
  }
}
