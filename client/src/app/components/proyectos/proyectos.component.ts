import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { Proyecto } from 'src/app/models/proyecto';
import { ProyectoService } from 'src/app/services/proyecto.service';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css']
})
export class ProyectosComponent implements OnInit{

  registroModalAbierto = false;
  passwordModalAbierto = false;
  modificacionModalAbierto = false;
  proyectos: any = [];
  proyectosArea: any = [];
  pk_proyecto: any;
  proyectoCreado: Proyecto = {};
  modificacionProyecto: any = [];
  displayedColumns: string[] = ['Nombre', 'Fecha de inicio', 'Fecha de finalizacion', 'Estado', 'Fecha de término', 'Area', 'Acciones'];
  displayedColumnsArea: string[] = ['Nombre', 'Fecha de inicio', 'Fecha de finalizacion', 'Estado', 'Fecha de término', 'Acciones'];
  proyectosDataSource = new MatTableDataSource(this.proyectos);
  proyectosAreaDataSource = new MatTableDataSource(this.proyectosArea);

  datoSesion: any = [];
  datoSesionObject: any = [];
  rol: any = null;

  constructor(private proyectoService: ProyectoService, private toastr: ToastrService, private dialog: MatDialog, private router: Router){}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

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

    if(this.rol == 3 || this.rol == 4){
      this.obtenerProyectosArea();
    }else{
      this.obtenerProyectos();
    }
  }

  obtenerProyectos(){
    this.proyectoService.obtenerProyectos().subscribe((res) => {
      this.proyectos = res;
      this.proyectosDataSource = new MatTableDataSource(this.proyectos);
      this.proyectosDataSource.paginator = this.paginator;
    },err => console.log(err)
    );
  }

  obtenerProyectosArea(){
    this.proyectoService.obtenerProyectosArea(this.datoSesionObject.fk_area).subscribe((res) => {
      this.proyectosArea = res;
      this.proyectosAreaDataSource = new MatTableDataSource(this.proyectosArea);
      this.proyectosAreaDataSource.paginator = this.paginator;
    },err => console.log(err)
    );
  }

  proyectosFiltro(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.proyectosDataSource.filter = filterValue.trim().toLowerCase();
  
    if (this.proyectosDataSource.paginator) {
      this.proyectosDataSource.paginator.firstPage();
    }
  }

  proyectosAreaFiltro(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.proyectosAreaDataSource.filter = filterValue.trim().toLowerCase();
  
    if (this.proyectosAreaDataSource.paginator) {
      this.proyectosAreaDataSource.paginator.firstPage();
    }
  }

  eliminarProyecto(pk_proyecto: any){
    this.proyectoService.eliminarProyecto(pk_proyecto).subscribe(res =>{
      this.toastr.success('Se ha eliminado el proyecto exitosamente','Hecho',{
        timeOut: 3000
      })
      this.obtenerProyectosArea()
    })
  }

  abrirRegistroModal(){
    this.registroModalAbierto = true;
  }

  abrirModificacionModal(pk_proyecto: any){
    this.modificacionModalAbierto = true;
    this.pk_proyecto = pk_proyecto
    this.proyectoService.verProyecto(pk_proyecto).subscribe(res => {
      this.modificacionProyecto = res;
      const fechaInicio = this.modificacionProyecto.fecha_inicio.toString();
      this.modificacionProyecto.fecha_inicio = fechaInicio.substring(0,10);

      const fechaFin = this.modificacionProyecto.fecha_fin.toString();
      this.modificacionProyecto.fecha_fin = fechaFin.substring(0,10);
    })
  }


  cerrarRegistroModal(){
    this.registroModalAbierto = false;
    this.proyectoCreado = {};
  }

  cerrarModificacionModal(){
    this.modificacionModalAbierto = false;
  }

  crearProyecto(){
    this.proyectoCreado.estado = false;
    this.proyectoCreado.fk_area = this.datoSesionObject.fk_area
    this.proyectoService.registrarProyecto(this.proyectoCreado).subscribe(res => {
      this.toastr.success('El proyecto ha sido registrado exitosamente','Éxito',{timeOut: 3000})
      this.registroModalAbierto = false;
      this.proyectoCreado = {};
      this.obtenerProyectosArea();
    },err => {
      this.toastr.error('No se pudo registrar el proyecto','Error',{timeOut: 3000})
    })
  }

  modificarProyecto(){
    this.proyectoService.modificarProyecto(this.pk_proyecto, this.modificacionProyecto).subscribe(res =>{
      this.toastr.success('Se modificó el proyecto exitosamente','Éxito',{timeOut: 3000})
      this.modificacionModalAbierto = false;
      this.modificacionProyecto = {};
      this.obtenerProyectosArea();
    },err => {
      this.toastr.warning('No se pudieron actualizar los datos del proyecto', 'Error', {
        timeOut: 3000
      });
      console.log(err);
    })
  }
}