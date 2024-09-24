import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit {

  searchQuery: string = '';
  filteredKeywords: string[] = [];
  showResults: boolean = true;
  
  // Datos de la sesión
  datoSesion: any = sessionStorage.getItem('userData');
  datoSesionObject: any;
  usuario: any = null;
  rol: any = null;

  // Mapa del sitio
  siteMap: any = {};

  constructor(
    private router: Router,
    private elementRef: ElementRef,
  ) {}
    
  ngOnInit() {
    if (this.datoSesion) {
      this.datoSesionObject = JSON.parse(this.datoSesion);
      if (this.datoSesionObject) {
        this.usuario = this.datoSesionObject.nombre;
        this.rol = this.datoSesionObject.fk_rol;
      }
    }

    // Construir mapa del sitio
    this.buildSiteMap();
    console.log(this.siteMap)
  }

  buildSiteMap() {
    // Rutas para todos
    this.siteMap['principal'] = ['Home','/'];

    this.siteMap['informacion'] = [
      ['Política de Privacidad', '/politica-privacidad'],
      ['Política de Seguridad', '/politica-seguridad'],
      ['Mapa del Sitio', '/mapa-del-sitio']
    ];

    // Cuando aún no tienen cuenta ni se han logueado
    if(this.rol == null){
      this.siteMap['sesion'] = [ 
        ['Inicio de Sesión','/login'],
        ['Registro','/registro']
      ];
    }

    // Privilegios solo de admin, y CEO
    if (this.rol == 1 || this.rol == 2) {
      this.siteMap['administracion'] = [
        ['Equipos/Areas', '/equipo-area']
      ];
    }

    // Privilegios solo de admin, CEO y supervisor
    if (this.rol == 1 || this.rol == 2 || this.rol == 3) {
      if (!this.siteMap['administracion']) {
        this.siteMap['administracion'] = [];
      }
      this.siteMap['administracion'].push(['Empleados', '/usuarios']);
    }

    // Privilegios de todos los logueados
    if (this.rol != null) {
      if (!this.siteMap['administracion']) {
        this.siteMap['administracion'] = [];
      }
      this.siteMap['administracion'].push(['Proyectos/Actividades', '/proyectos']);
    }

    // Privilegios pa CEO, supervisor y empleado
    if (this.rol == 2 || this.rol == 3 || this.rol == 4) {
      if (!this.siteMap['administracion']) {
        this.siteMap['administracion'] = [];
      }
      this.siteMap['administracion'].push(['Notificaciones', '/notificaciones']);
    }
  }
}