import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit{

  datoSesion: any = sessionStorage.getItem('userData');
  datoSesionObject: any;
  rol: any = null;

  ngOnInit(): void {
    if (this.datoSesion) {
      this.datoSesionObject = JSON.parse(this.datoSesion);
      if (this.datoSesionObject) {
        this.rol = this.datoSesionObject.fk_rol;
      }
    }
  }
}