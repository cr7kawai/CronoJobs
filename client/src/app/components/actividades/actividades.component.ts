import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Actividad } from 'src/app/models/actividad';
import { ActividadService } from 'src/app/services/actividad.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-actividades',
  templateUrl: './actividades.component.html',
  styleUrls: ['./actividades.component.css']
})
export class ActividadesComponent implements OnInit{

  registroModalAbierto = false;
  modificacionModalAbierto = false;
  actividades: any = [];
  usuarios: any = [];
  pk_proyecto: any;
  pk_actividad: any;
  actividadCreada: Actividad = {};
  modificacionActividad: any = [];
  displayedColumns: string[] = ['Nombre', 'Fecha de inicio', 'Fecha de finalizacion', 'Estado', 'Fecha de término', 'Acciones'];
  dataSource = new MatTableDataSource(this.actividades);

  datoSesion: any = [];
  datoSesionObject: any = [];
  rol: any = null;

  constructor(private actividadService: ActividadService, private usuarioService: UsuarioService, private toastr: ToastrService, private dialog: MatDialog, private activatedRoute: ActivatedRoute, private router: Router){}

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

    this.pk_proyecto = this.activatedRoute.snapshot.paramMap.get('id_proyecto');
    if(this.rol == 1,2,3){
      this.obtenerActividades();
    }else{
      this.obtenerActividadesEmpleado();
    }
    if(this.datoSesionObject.fk_area){
      this.usuarioService.obtenerUsuariosArea(this.datoSesionObject.fk_area).subscribe(res =>{
        this.usuarios = res;
      },err => console.log(err))
    }
  }

  obtenerActividades(){
    this.actividadService.obtenerActividades(this.pk_proyecto).subscribe((res) => {
      this.actividades = res;
      this.dataSource = new MatTableDataSource(this.actividades);
      this.dataSource.paginator = this.paginator;
    },err => console.log(err)
    );
  }

  obtenerActividadesEmpleado(){
    this.actividadService.obtenerActividadesEmpleado(this.pk_proyecto,this.datoSesionObject.pk_usuario).subscribe((res) => {
      this.actividades = res;
      this.dataSource = new MatTableDataSource(this.actividades);
      this.dataSource.paginator = this.paginator;
    },err => console.log(err)
    );
  }

  actividadesFiltro(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  eliminarActividad(pk_actividad: any){
    this.actividadService.eliminarActividad(pk_actividad).subscribe(res =>{
      this.toastr.success('Se ha eliminado la actividad exitosamente','Éxito',{
        timeOut: 3000
      })
      this.obtenerActividades()
    })
  }

  abrirRegistroModal(){
    this.registroModalAbierto = true;
  }

  abrirModificacionModal(pk_actividad: any){
    this.modificacionModalAbierto = true;
    this.pk_actividad = pk_actividad
    this.actividadService.obtenerActividad(pk_actividad).subscribe(res => {
      this.modificacionActividad = res;
      const fechaInicio = this.modificacionActividad.fecha_inicio.toString();
      this.modificacionActividad.fecha_inicio = fechaInicio.substring(0,10);

      const fechaFin = this.modificacionActividad.fecha_fin.toString();
      this.modificacionActividad.fecha_fin = fechaFin.substring(0,10);
    })
  }

  cerrarRegistroModal(){
    this.registroModalAbierto = false;
    this.actividadCreada = {};
  }

  cerrarModificacionModal(){
    this.modificacionModalAbierto = false;
  }

  crearActividad(){
    this.actividadCreada.estado = false;
    this.actividadCreada.fk_proyecto = this.pk_proyecto;
    this.actividadService.registrarActividad(this.actividadCreada).subscribe(res => {
      this.toastr.success('La actividad ha sido registrada exitosamente','Éxito',{timeOut: 3000})
      this.registroModalAbierto = false;
      this.obtenerActividades();
    },err => {
      this.toastr.error('No se pudo registrar la actividad','Error',{timeOut: 3000})
    })
  }

  modificarActividad(){
    this.actividadService.modificarActividad(this.pk_actividad, this.modificacionActividad).subscribe(res =>{
      this.toastr.success('Se modificó la actividad exitosamente','Éxito',{timeOut: 3000})
      this.modificacionModalAbierto = false;
      this.modificacionActividad = {};
      this.obtenerActividades();
    },err => {
      this.toastr.warning('No se pudieron actualizar los datos de la actividad', 'Error', {
        timeOut: 3000
      });
      console.log(err);
    })
  }
}