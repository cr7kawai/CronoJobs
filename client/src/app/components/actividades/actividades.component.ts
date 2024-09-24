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
import { AuthService } from 'src/app/services/auth.service';
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

  // Datos de la sesión
  datoSesion: any;
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

  btnCrearActividad = true;
  btnCrearComentario = true;

  constructor(
    private actividadService: ActividadService,
    private usuarioService: UsuarioService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private proyectoService: ProyectoService,
    private authService: AuthService
  ) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    // Validar si el usuario ha iniciado sesión
    this.datoSesion = this.authService.getUserData();

    if (this.datoSesion) {
      this.rol = this.datoSesion.fk_rol || null;
      this.area = this.datoSesion.fk_area || null;
      this.empresa = this.datoSesion.fk_empresa || null;
      this.plan = this.datoSesion.fk_suscripcion || null;
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
    if (this.datoSesion.fk_area) {
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
        this.datoSesion.pk_usuario
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
    this.btnCrearActividad = true;
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
    if (!this.actividadCreada.nombre) {
      this.toastr.error('El nombre de la actividad es requerido', 'Error', { timeOut: 3000 });
      return;
    }
  
    if (this.actividadCreada.nombre.length < 3 || this.actividadCreada.nombre.length > 100) {
      this.toastr.error('El nombre de la actividad debe tener entre 3 y 50 caracteres', 'Error', { timeOut: 3000 });
      return;
    }
  
    // Validación de la descripción
    if (!this.actividadCreada.descripcion) {
      this.toastr.error('La descripción es requerida', 'Error', { timeOut: 3000 });
      return;
    }
  
    if (this.actividadCreada.descripcion.length < 10 || this.actividadCreada.descripcion.length > 450) {
      this.toastr.error('La descripción debe tener entre 10 y 450 caracteres', 'Error', { timeOut: 3000 });
      return;
    }

    // Validación de la fecha de inicio
    if (!this.actividadCreada.fecha_inicio) {
      this.toastr.error('La fecha de inicio es requerida', 'Error', { timeOut: 3000 });
      return;
    }

    // Validación de la fecha fin
    if (!this.actividadCreada.fecha_fin) {
      this.toastr.error('La fecha de finalización es requerida', 'Error', { timeOut: 3000 });
      return;
    }
  
    // Validación de las fechas
    const fechaInicio = new Date(this.actividadCreada.fecha_inicio);
    const fechaFin = new Date(this.actividadCreada.fecha_fin);
  
    if (fechaInicio >= fechaFin) {
      this.toastr.error('La fecha de finalización debe ser mayor a la fecha de inicio', 'Error', { timeOut: 3000 });
      return;
    }

    if (!this.actividadCreada.fk_usuario) {
      this.toastr.error('Se le debe de asignar un empleado a la actividad', 'Error', { timeOut: 3000 });
      return;
    }

    this.btnCrearActividad = false;
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
        this.btnCrearActividad = true;
      }
    );
  }

  modificarActividad() {
    if (!this.modificacionActividad.nombre) {
      this.toastr.error('El nombre de la actividad es requerido', 'Error', { timeOut: 3000 });
      return;
    }
  
    if (this.modificacionActividad.nombre.length < 3 || this.modificacionActividad.nombre.length > 100) {
      this.toastr.error('El nombre de la actividad debe tener entre 3 y 50 caracteres', 'Error', { timeOut: 3000 });
      return;
    }
  
    // Validación de la descripción
    if (!this.modificacionActividad.descripcion) {
      this.toastr.error('La descripción es requerida', 'Error', { timeOut: 3000 });
      return;
    }
  
    if (this.modificacionActividad.descripcion.length < 10 || this.modificacionActividad.descripcion.length > 450) {
      this.toastr.error('La descripción debe tener entre 10 y 450 caracteres', 'Error', { timeOut: 3000 });
      return;
    }

    // Validación de la fecha de inicio
    if (!this.modificacionActividad.fecha_inicio) {
      this.toastr.error('La fecha de inicio es requerida', 'Error', { timeOut: 3000 });
      return;
    }

    // Validación de la fecha fin
    if (!this.modificacionActividad.fecha_fin) {
      this.toastr.error('La fecha de finalización es requerida', 'Error', { timeOut: 3000 });
      return;
    }
  
    // Validación de las fechas
    const fechaInicio = new Date(this.modificacionActividad.fecha_inicio);
    const fechaFin = new Date(this.modificacionActividad.fecha_fin);
  
    if (fechaInicio >= fechaFin) {
      this.toastr.error('La fecha de finalización debe ser mayor a la fecha de inicio', 'Error', { timeOut: 3000 });
      return;
    }

    if (!this.modificacionActividad.fk_usuario) {
      this.toastr.error('Se le debe de asignar un empleado a la actividad', 'Error', { timeOut: 3000 });
      return;
    }

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
    this.btnCrearComentario = true;
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

    if (!this.comentarioCreado.descripcion) {
      this.toastr.error('La descripción es requerida', 'Error', { timeOut: 3000 });
      return;
    }
  
    if (this.comentarioCreado.descripcion.length < 10 || this.comentarioCreado.descripcion.length > 450) {
      this.toastr.error('La descripción debe tener entre 10 y 450 caracteres', 'Error', { timeOut: 3000 });
      return;
    }

    this.btnCrearComentario = false;
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
          this.btnCrearComentario = true;
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
