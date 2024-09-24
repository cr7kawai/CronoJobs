import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Actividad } from 'src/app/models/actividad';
import { Comentario } from 'src/app/models/comentario';
import { Proyecto } from 'src/app/models/proyecto';
import { ActividadService } from 'src/app/services/actividad.service';
import { ProyectoService } from 'src/app/services/proyecto.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-actividades',
  templateUrl: './actividades.component.html',
  styleUrls: ['./actividades.component.css'],
})
export class ActividadesComponent implements OnInit {
  registroModalAbierto = false;
  modificacionModalAbierto = false;
  actividades: any = [];
  usuarios: any = [];
  pk_proyecto: any;
  pk_actividad: any;
  actividadCreada: Actividad = {};
  modificacionActividad: any = [];
  displayedColumns: string[] = [
    'Nombre',
    'Fecha de inicio',
    'Fecha de finalizacion',
    'Estado',
    'Fecha de término',
    'Acciones',
  ];
  dataSource = new MatTableDataSource(this.actividades);

  datoSesion: any = [];
  datoSesionObject: any = [];
  rol: any = null;
  area: any = null;
  empresa: any = null;
  plan: any = null;

  actividadDetallesModalAbierto = false;
  actividadSeleccionada: any = null;
  comentarioModalAbierto = false;
  comentarioCreado: Comentario = {};
  comentarios: any = [];
  nombreProyecto: string = '';

  constructor(
    private actividadService: ActividadService,
    private usuarioService: UsuarioService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private proyectoService: ProyectoService
  ) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    // Validar si el usuario ha iniciado sesión
    this.datoSesion = sessionStorage.getItem('userData');
    this.datoSesionObject = JSON.parse(this.datoSesion);

    if (this.datoSesionObject) {
      this.rol = this.datoSesionObject.fk_rol || null;
      this.area = this.datoSesionObject.fk_area || null;
      this.empresa = this.datoSesionObject.fk_empresa || null;
      this.plan = this.datoSesionObject.fk_suscripcion || null;
    } else {
      this.router.navigate(['/403']);
      return;
    }

    this.pk_proyecto = this.activatedRoute.snapshot.paramMap.get('id_proyecto');
    if ((this.rol == 1, 2, 3)) {
      this.obtenerActividades();
    } else {
      this.obtenerActividadesEmpleado();
    }
    if (this.datoSesionObject.fk_area) {
      this.usuarioService
        .obtenerUsuariosArea(this.area, this.empresa)
        .subscribe(
          (res) => {
            this.usuarios = res;
          },
          (err) => console.log(err)
        );
    }
    this.obtenerComentarios();
    if (this.pk_proyecto) {
      this.proyectoService.obtenerProyecto(this.pk_proyecto).subscribe(
        (proyecto: Proyecto) => {
          // Suponiendo que el objeto Proyecto tiene una propiedad 'nombre'.
          this.nombreProyecto = proyecto.nombre || 'Proyecto Desconocido';
        },
        (error) => {
          console.error('Error al obtener el proyecto', error);
          this.nombreProyecto = 'Proyecto Desconocido';
        }
      );
    }
  }

  obtenerActividades() {
    this.actividadService.obtenerActividades(this.pk_proyecto).subscribe(
      (res) => {
        this.actividades = res;
        this.dataSource = new MatTableDataSource(this.actividades);
        this.dataSource.paginator = this.paginator;
      },
      (err) => console.log(err)
    );
  }

  obtenerActividadesEmpleado() {
    this.actividadService
      .obtenerActividadesEmpleado(
        this.pk_proyecto,
        this.datoSesionObject.pk_usuario
      )
      .subscribe(
        (res) => {
          this.actividades = res;
          this.dataSource = new MatTableDataSource(this.actividades);
          this.dataSource.paginator = this.paginator;
        },
        (err) => console.log(err)
      );
  }

  actividadesFiltro(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  eliminarActividad(pk_actividad: any) {
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
        this.actividadService.eliminarActividad(pk_actividad).subscribe((res) => {
          this.toastr.success(
            'Se ha eliminado la actividad exitosamente',
            'Éxito',
            {
              timeOut: 3000,
            }
          );
          this.obtenerActividades();
        },(error) => {
          this.toastr.error('No se ha podido eliminar la actividad','Error',{
            timeOut: 3000
          })
        });
      }
    });
  }

  abrirRegistroModal() {
    this.registroModalAbierto = true;
  }

  abrirModificacionModal(pk_actividad: any) {
    this.modificacionModalAbierto = true;
    this.pk_actividad = pk_actividad;
    this.actividadService.obtenerActividad(pk_actividad).subscribe((res) => {
      this.modificacionActividad = res;
      const fechaInicio = this.modificacionActividad.fecha_inicio.toString();
      this.modificacionActividad.fecha_inicio = fechaInicio.substring(0, 10);

      const fechaFin = this.modificacionActividad.fecha_fin.toString();
      this.modificacionActividad.fecha_fin = fechaFin.substring(0, 10);
    });
  }

  cerrarRegistroModal() {
    this.registroModalAbierto = false;
    this.actividadCreada = {};
  }

  cerrarModificacionModal() {
    this.modificacionModalAbierto = false;
  }

  crearActividad() {
    this.actividadCreada.estado = false;
    this.actividadCreada.fk_proyecto = this.pk_proyecto;
    this.actividadService.registrarActividad(this.actividadCreada).subscribe(
      (res) => {
        this.toastr.success(
          'La actividad ha sido registrada exitosamente',
          'Éxito',
          { timeOut: 3000 }
        );
        this.registroModalAbierto = false;
        this.obtenerActividades();
      },
      (err) => {
        this.toastr.error('No se pudo registrar la actividad', 'Error', {
          timeOut: 3000,
        });
      }
    );
  }

  modificarActividad() {
    this.actividadService
      .modificarActividad(this.pk_actividad, this.modificacionActividad)
      .subscribe(
        (res) => {
          this.toastr.success(
            'Se modificó la actividad exitosamente',
            'Éxito',
            { timeOut: 3000 }
          );
          this.modificacionModalAbierto = false;
          this.modificacionActividad = {};
          this.obtenerActividades();
        },
        (err) => {
          this.toastr.warning(
            'No se pudieron actualizar los datos de la actividad',
            'Error',
            {
              timeOut: 3000,
            }
          );
          console.log(err);
        }
      );
  }

  abrirActividadDetallesModal(pk_actividad: any) {
    this.actividadService.verActividad(pk_actividad).subscribe(
      (actividad) => {
        this.actividadSeleccionada = actividad;
        this.actividadDetallesModalAbierto = true;
      },
      (error) => {
        this.toastr.error('Error al cargar los detalles de la actividad');
        console.error(error);
      }
    );
  }

  cerrarActividadDetallesModal() {
    this.actividadDetallesModalAbierto = false;
    this.actividades = {};
    this.obtenerComentarios();
  }

  abrirComentariosModal(actividad: any) {
    this.actividadSeleccionada = actividad; // Guarda la actividad seleccionada
    this.pk_actividad = actividad.pk_actividad; // Guarda el ID de la actividad para futuras referencias
    this.comentarioModalAbierto = true; // Abre el modal
    this.obtenerComentarios(); // Obtiene los comentarios relacionados con la actividad
  }

  cerrarComentariosModal() {
    this.comentarioModalAbierto = false;
    this.comentarioCreado = {};
    this.comentarios = {};
  }

  obtenerComentarios() {
    this.actividadService
      .obtenerComentariosActividad(this.pk_actividad)
      .subscribe(
        (res) => {
          this.comentarios = res; // Guarda los comentarios obtenidos
          // Puedes quitar el console.log si ya no lo necesitas
        },
        (err) => console.log(err)
      );
  }

  agregarComentario() {
    this.comentarioCreado.fk_actividad = this.pk_actividad;
    const fecha = new Date();
    this.comentarioCreado.fecha = fecha.toISOString().slice(0, 10);
    this.actividadService
      .registrarComentarioActividad(this.comentarioCreado)
      .subscribe(
        (res) => {
          this.toastr.success(
            'El comentario ha sido agregado exitosamente',
            'Éxito',
            { timeOut: 3000 }
          );
          this.comentarioModalAbierto = false;
          this.obtenerComentarios();
          this.limpiarFormularioComentario();
        },
        (err) => {
          this.toastr.error('No se pudo agregar el comentario', 'Error', {
            timeOut: 3000,
          });
        }
      );
  }

  limpiarFormularioComentario() {
    this.comentarioCreado = {};
  }

  culminarActividad(pk_actividad: any) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Confirmas la culminación de esta actividad?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, culminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.actividadService
          .actualizarEstadoActividad(pk_actividad, { estado: 'Culminado' }) // Asegúrate de que el backend procesa este cambio de estado.
          .subscribe(
            (res) => {
              this.toastr.success(
                'La actividad ha sido culminada exitosamente',
                'Culminada',
                {
                  timeOut: 3000,
                }
              );
              this.obtenerActividades();
            },
            (err) => {
              this.toastr.error(
                'Hubo un problema al culminar la actividad',
                'Error',
                {
                  timeOut: 3000,
                }
              );
            }
          );
      }
    });
  }
}
