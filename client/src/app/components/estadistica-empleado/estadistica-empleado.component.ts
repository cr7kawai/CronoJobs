import { Component, OnInit, ViewChild } from '@angular/core';
import { ActividadService } from 'src/app/services/actividad.service';
import { forkJoin } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Notificacion } from 'src/app/models/notificacion';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-estadistica-empleado',
  templateUrl: './estadistica-empleado.component.html',
  styleUrls: ['./estadistica-empleado.component.css'],
})
export class EstadisticaEmpleadoComponent implements OnInit {
  notificacionModalAbierto = false;
  data: any;
  options: any;
  completas: any = [];
  pendientes: any = [];
  retrasadas: any = [];
  usuario: any = [];
  notificacionCreada: Notificacion = {};
  displayedColumns: string[] = [
    'Actividad',
    'Fecha de inicio',
    'Fecha de finalización',
    'Fecha de término',
    'Proyecto',
    'Acciones',
  ];
  completasDataSource = new MatTableDataSource(this.completas.actividades);
  pendientesDataSource = new MatTableDataSource(this.pendientes.actividades);
  retrasadasDataSource = new MatTableDataSource(this.retrasadas.actividades);
  total: any;
  porcentajeEmpleado: any;
  usuarioId: any;

  notificacionBoton = true;

  // Datos de la sesión
  datoSesion: any;
  rol: any = null;

  usuarioCompleto: Usuario | undefined; // Donde Usuario es la interface que tienes definida

  constructor(
    private actividadesService: ActividadService,
    private usuarioService: UsuarioService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  @ViewChild(MatPaginator) paginatorCompleta!: MatPaginator;
  @ViewChild(MatPaginator) paginatorPendiente!: MatPaginator;
  @ViewChild(MatPaginator) paginatorRetrasada!: MatPaginator;

  ngOnInit() {
    // Obtener datos del inicio de sesión
    this.datoSesion = this.authService.getUserData();

    if (this.datoSesion) {
      this.rol = this.datoSesion.fk_rol || null;
    }

    // No permitir el acceso a los empleados y a los que no han iniciado sesión
    if (this.rol == null || this.rol == 4) {
      this.router.navigate(['/403']);
      return;
    }

    this.usuarioId = this.activatedRoute.snapshot.paramMap.get('id_usuario');
    forkJoin([
      this.actividadesService.actividadesCumplidasEmpleado(this.usuarioId),
      this.actividadesService.actividadesPendientesEmpleado(this.usuarioId),
      this.actividadesService.actividadesRetrasadasEmpleado(this.usuarioId),
      this.usuarioService.verUsuario(this.usuarioId),
    ]).subscribe(
      ([completas, pendientes, retrasadas, usuario]) => {
        this.completas = completas;
        this.pendientes = pendientes;
        this.retrasadas = retrasadas;
        this.usuario = usuario;
        this.total =
          this.completas.cantidadResultados +
          this.pendientes.cantidadResultados +
          this.retrasadas.cantidadResultados;
        this.porcentajeEmpleado =
          (100 * this.completas.cantidadResultados) / this.total;
        this.dibujarGrafica();
        this.obtenerCompletas();
        this.obtenerPendientes();
        this.obtenerRetrasadas();
      },
      (error) => {
        console.error('Error al obtener datos:', error);
      }
    );
    this.usuarioService.verUsuario(this.usuarioId).subscribe(
      (usuario: Usuario) => {
        // Aquí tienes la información del usuario y puedes concatenar el nombre completo
        this.usuarioCompleto = usuario; // Ahora usuarioCompleto tiene toda la información del usuario
        // Si quieres formar un string con el nombre completo podrías hacer algo como esto:
        const nombreCompleto = `${usuario.nombre} ${usuario.ape_paterno} ${usuario.ape_materno}`;
        // Y ahora puedes usar nombreCompleto donde lo necesites en tu componente
      },
      (error) => {
        console.error('Error al obtener el usuario', error);
        // Manejar el error como creas conveniente
      }
    );
  }

  obtenerCompletas() {
    this.actividadesService
      .actividadesCumplidasEmpleado(this.usuarioId)
      .subscribe((res) => {
        this.completas = res;
        this.completasDataSource = new MatTableDataSource(
          this.completas.actividades
        );
        this.completasDataSource.paginator = this.paginatorCompleta;
      });
  }
  obtenerPendientes() {
    this.actividadesService
      .actividadesPendientesEmpleado(this.usuarioId)
      .subscribe((res) => {
        this.pendientes = res;
        this.pendientesDataSource = new MatTableDataSource(
          this.pendientes.actividades
        );
        this.pendientesDataSource.paginator = this.paginatorPendiente;
      });
  }
  obtenerRetrasadas() {
    this.actividadesService
      .actividadesRetrasadasEmpleado(this.usuarioId)
      .subscribe((res) => {
        this.retrasadas = res;
        this.retrasadasDataSource = new MatTableDataSource(
          this.retrasadas.actividades
        );
        this.retrasadasDataSource.paginator = this.paginatorRetrasada;
      });
  }

  dibujarGrafica() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    this.data = {
      labels: [
        'Actividades cumplidas',
        'Actividades pendientes',
        'Actividades retrasadas',
      ],
      datasets: [
        {
          data: [
            this.completas.cantidadResultados,
            this.pendientes.cantidadResultados,
            this.retrasadas.cantidadResultados,
          ],
          backgroundColor: ['#28a745', '#ffc107', '#F13636'],
          hoverBackgroundColor: ['#1f8c3a', '#e0a800', '#C0392B'],
        },
      ],
    };
    this.options = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor,
          },
        },
      },
    };
  }

  filtroCompletas(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.completasDataSource.filter = filterValue.trim().toLowerCase();

    if (this.completasDataSource.paginator) {
      this.completasDataSource.paginator.firstPage();
    }
  }

  filtroPendientes(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.pendientesDataSource.filter = filterValue.trim().toLowerCase();

    if (this.pendientesDataSource.paginator) {
      this.pendientesDataSource.paginator.firstPage();
    }
  }

  filtroRetrasadas(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.retrasadasDataSource.filter = filterValue.trim().toLowerCase();

    if (this.retrasadasDataSource.paginator) {
      this.retrasadasDataSource.paginator.firstPage();
    }
  }

  abrirNotificacionModal() {
    this.notificacionModalAbierto = true;
    this.notificacionBoton = true;
  }

  cerrarNotificacionModal() {
    this.notificacionModalAbierto = false;
    this.notificacionCreada = {};
  }

  crearNotificacion() {

    if (!this.notificacionCreada.comentario) {
      this.toastr.error('El comentario es requerido', 'Error', { timeOut: 3000 });
      return;
    }
  
    if (this.notificacionCreada.comentario.length < 3 || this.notificacionCreada.comentario.length > 450) {
      this.toastr.error('El comentario debe tener entre 3 y 450 caracteres', 'Error', { timeOut: 3000 });
      return;
    }

    this.notificacionBoton = false

    this.notificacionCreada.fk_usuario = this.usuario.pk_usuario;
    const fecha = new Date();
    this.notificacionCreada.fecha = fecha.toISOString().slice(0, 10);
    this.usuarioService.enviarNotificacion(this.notificacionCreada).subscribe(
      (res) => {
        this.toastr.success(
          'La notificación se ha enviado exitosamente',
          'Éxito',
          { timeOut: 3000 }
        );
        this.notificacionModalAbierto = false;
        this.notificacionCreada = {};
      },
      (err) => {
        this.toastr.warning('No se pudo enviar la notificacion', 'Error', {
          timeOut: 3000,
        });
      }
    );
  }
}
