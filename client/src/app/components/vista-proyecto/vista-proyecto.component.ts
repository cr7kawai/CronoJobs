import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Nota } from 'src/app/models/nota';
import { NotaService } from 'src/app/services/nota.service';
import { ProyectoService } from 'src/app/services/proyecto.service';

@Component({
  selector: 'app-vista-proyecto',
  templateUrl: './vista-proyecto.component.html',
  styleUrls: ['./vista-proyecto.component.css']
})
export class VistaProyectoComponent implements OnInit{

  notaModalAbierto = false;
  proyecto: any = [];
  pk_proyecto: any;
  notas: any = [];
  notaCreada: Nota ={};

  // Datos de la sesión
  datoSesion: any = [];
  datoSesionObject: any = [];
  rol: any = null;

  constructor(private activatedRoute: ActivatedRoute, private notaService: NotaService, private proyectoService: ProyectoService, private toastr: ToastrService, private router: Router){}

  ngOnInit(): void {
    // Validar si el usuario ha iniciado sesión
    this.datoSesion = sessionStorage.getItem('userData');
    this.datoSesionObject = JSON.parse(this.datoSesion);

    if (this.datoSesionObject) {
      this.rol = this.datoSesionObject.fk_rol || null;
    }else{
      this.router.navigate(['/403']);
      return;
    }

    this.pk_proyecto = this.activatedRoute.snapshot.paramMap.get('id_proyecto');
    this.obtenerProyecto()
    this.obtenerNotas()
  }

  obtenerProyecto(){
    this.proyectoService.obtenerProyecto(this.pk_proyecto).subscribe(res =>{
      this.proyecto = res;
    },err => console.log(err))
  }

  obtenerNotas(){
    this.notaService.obtenerNotas(this.pk_proyecto).subscribe(res =>{
      this.notas = res;
    },err => console.log(err))
  }

  culminarProyecto(){
    this.proyectoService.modificarEstadoProyecto(this.pk_proyecto, this.proyecto).subscribe(res => {
      this.toastr.success('Se culminó el proyecto de manera correcta','Éxito',{timeOut: 3000})
      this.obtenerProyecto();
    },err => {this.toastr.error('No se pudo culminar el proyecto','Error',{timeOut: 3000})})
  }

  abrirNotaModal(){
    this.notaModalAbierto = true;
  }
  cerrarNotaModal(){
    this.notaModalAbierto = false;
    this.notaCreada = {}
  }

  agregarNota(){
    const fecha = new Date();
    this.notaCreada.fecha = fecha.toISOString().slice(0,10);
    this.notaCreada.fk_proyecto = this.pk_proyecto;
    this.notaService.registrarNota(this.notaCreada).subscribe(res =>{
      this.toastr.success('La nota ha sido agregada exitosamente','Éxito',{timeOut: 3000})
      this.notaModalAbierto = false;
      this.obtenerNotas();
    },err => {
      this.toastr.error('No se pudo agregar la nota','Error',{timeOut: 3000})
    })
  }
}
