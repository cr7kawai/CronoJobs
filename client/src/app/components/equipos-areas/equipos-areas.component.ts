import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { EquipoArea } from 'src/app/models/equipo-area';
import { AuthService } from 'src/app/services/auth.service';
import { EquipoAreaService } from 'src/app/services/equipo-area.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-equipos-areas',
  templateUrl: './equipos-areas.component.html',
  styleUrls: ['./equipos-areas.component.css']
})
export class EquiposAreasComponent implements OnInit{

  registroModalAbierto = false;
  passwordModalAbierto = false;
  modificacionModalAbierto = false;
  equiposAreas: any = [];
  displayedColumns: string[] = ['Clave', 'Nombre', 'Acciones'];
  dataSource = new MatTableDataSource(this.equiposAreas);
  
  equipoCreado: EquipoArea = {}

  datosEquipo: any = [];
  pk_area: any = null;


  botonHabilitado: boolean = true;

  // Identificadores del usuario
  datoSesion: any;
  rol: any = null;
  area: any = null;
  empresa: any = null;
  plan: any = null;

  constructor(
    private equipoAreaService: EquipoAreaService, 
    private toastr: ToastrService, 
    private dialog: MatDialog, 
    private router: Router,
    private authService: AuthService
  ){}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    // Validar si el usuario ha iniciado sesión
    this.datoSesion = this.authService.getUserData();

    if (this.datoSesion) {
      this.rol = this.datoSesion.fk_rol || null;
      this.area = this.datoSesion.fk_area || null;
      this.empresa = this.datoSesion.fk_empresa || null;
      this.plan = this.datoSesion.fk_suscripcion || null;
    }

    if(this.rol != null && this.rol != 4){
      if(this.rol == 1  || this.rol == 2 || this.rol == 3){
        this.obtenerAreas();
      }
    }else{
      this.router.navigate(['/403']);
      return;
    }
  }

  obtenerAreas(){
    this.equipoAreaService.obtenerAreas(this.empresa).subscribe((res) => {
      this.equiposAreas = res;
      this.dataSource = new MatTableDataSource(this.equiposAreas);
      this.dataSource.paginator = this.paginator;
    },err => console.log(err)
    );
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  
  eliminarArea(pk_area: any) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Sí, eliminar!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.equipoAreaService.eliminarArea(pk_area).subscribe(
          (res) => {
            this.toastr.success('Se ha eliminado el equipo/área exitosamente','Hecho',{
              timeOut: 3000
            })
            this.obtenerAreas()
          },
          (error) => {
            this.toastr.error('No se pudo eliminar el equipo/área, porque tiene empleados asignados','Error',{
              timeOut: 3000
            })
          }
        );
      }
    });
  }

  abrirRegistroModal(){
    this.registroModalAbierto = true;
    this.botonHabilitado = true;
  }

  
  abrirModificacionModal(pk_area: any){
    this.modificacionModalAbierto = true;
    this.pk_area = pk_area;
    this.equipoAreaService.verArea(pk_area).subscribe(res => {
      this.datosEquipo = res;
    })
  }
  

  cerrarRegistroModal(){
    this.registroModalAbierto = false;
    this.equipoCreado = {};
  }

  cerrarModificacionModal(){
    this.modificacionModalAbierto = false;
  }

  crearArea(){
    if (!this.equipoCreado.nombre || this.equipoCreado.nombre.length < 3 || this.equipoCreado.nombre.length > 50) {
      this.toastr.error('El nombre del equipo/área debe tener entre 3 y 50 caracteres', 'Error', {timeOut: 3000});
      return;
    }

    // Esta madre tira paro pa que no se den varios clicks
    this.botonHabilitado = false

    // Registro
    this.equipoCreado.fk_empresa = this.empresa;
    this.equipoAreaService.registrarArea(this.equipoCreado).subscribe(res => {
      this.toastr.success('Los datos del equipo/área se guardaron exitosamente','Éxito',{timeOut: 3000})
      this.registroModalAbierto = false;
      this.equipoCreado = {};
      this.obtenerAreas();
    },err => {
      this.toastr.error('No se pudieron guardar los datos del equipo/área','Error',{timeOut: 3000})
    })
  }

  modificarArea(){
    if (!this.datosEquipo.nombre || this.datosEquipo.nombre.length < 3 || this.datosEquipo.nombre.length > 50) {
      this.toastr.error('El nombre del equipo/área debe tener entre 3 y 50 caracteres', 'Error', {timeOut: 3000});
      return;
    }

    this.equipoAreaService.modificarArea(this.pk_area, this.datosEquipo).subscribe(res =>{
      this.toastr.success('Se modificaron los datos del equipo/área exitosamente','Éxito',{timeOut: 3000})
      this.modificacionModalAbierto = false;
      this.datosEquipo = {};
      this.obtenerAreas();
    },err => {
      this.toastr.warning('No se pudieron actualizar los datos del equipo/área', 'Error', {
        timeOut: 3000
      });
      console.log(err);
    })
  }
}