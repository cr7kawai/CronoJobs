import { Component, OnInit, ViewChild } from '@angular/core';
import { ActividadService } from 'src/app/services/actividad.service';
import { forkJoin } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { ProyectoService } from 'src/app/services/proyecto.service';
import { Notificacion } from 'src/app/models/notificacion';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { Proyecto } from 'src/app/models/proyecto';

@Component({
  selector: 'app-estadistica-proyecto',
  templateUrl: './estadistica-proyecto.component.html',
  styleUrls: ['./estadistica-proyecto.component.css'],
})
export class EstadisticaProyectoComponent implements OnInit {
  notificacionModalAbierto = false;
  data: any;
  options: any;
  completas: any = [];
  pendientes: any = [];
  retrasadas: any = [];
  proyecto: any = [];
  notificacionCreada: Notificacion = {};
  usuarios: any = [];
  displayedColumns: string[] = [
    'Actividad',
    'Fecha de inicio',
    'Fecha de finalización',
    'Fecha de término',
    'Empleado que elabora',
    'Acciones',
  ];
  completasDataSource = new MatTableDataSource(this.completas.actividades);
  pendientesDataSource = new MatTableDataSource(this.pendientes.actividades);
  retrasadasDataSource = new MatTableDataSource(this.retrasadas.actividades);
  total: any;
  porcentajeProyecto: any;
  proyectoId: any;

  datoSesion: any = [];
  datoSesionObject: any = [];
  rol: any = null;
  nombreProyecto: string = '';

  constructor(
    private actividadesService: ActividadService,
    private usuarioService: UsuarioService,
    private toastr: ToastrService,
    private proyectoService: ProyectoService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  @ViewChild(MatPaginator) paginatorCompleta!: MatPaginator;
  @ViewChild(MatPaginator) paginatorPendiente!: MatPaginator;
  @ViewChild(MatPaginator) paginatorRetrasada!: MatPaginator;

  ngOnInit() {
    // Obtener datos del inicio de sesión
    this.datoSesion = sessionStorage.getItem('userData');
    this.datoSesionObject = JSON.parse(this.datoSesion);

    if (this.datoSesionObject) {
      this.rol = this.datoSesionObject.fk_rol || null;
    }

    // No permitir el acceso a los empleados y a los que no han iniciado sesión
    if (this.rol == null || this.rol == 4) {
      this.router.navigate(['/403']);
      return;
    }

    this.proyectoId = this.activatedRoute.snapshot.paramMap.get('id_proyecto');
    forkJoin([
      this.actividadesService.actividadesCumplidasProyecto(this.proyectoId),
      this.actividadesService.actividadesPendientesProyecto(this.proyectoId),
      this.actividadesService.actividadesRetrasadasProyecto(this.proyectoId),
      this.proyectoService.verProyecto(this.proyectoId),
    ]).subscribe(
      ([completas, pendientes, retrasadas, proyecto]) => {
        this.completas = completas;
        this.pendientes = pendientes;
        this.retrasadas = retrasadas;
        this.proyecto = proyecto;
        this.total =
          this.completas.cantidadResultados +
          this.pendientes.cantidadResultados +
          this.retrasadas.cantidadResultados;
        this.porcentajeProyecto =
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
    if (this.proyectoId) {
      this.proyectoService.obtenerProyecto(this.proyectoId).subscribe(
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

  obtenerCompletas() {
    this.actividadesService
      .actividadesCumplidasProyecto(this.proyectoId)
      .subscribe((res) => {
        this.completas = res;
        console.log(this.completas);
        this.completasDataSource = new MatTableDataSource(
          this.completas.actividades
        );
        this.completasDataSource.paginator = this.paginatorCompleta;
      });
  }
  obtenerPendientes() {
    this.actividadesService
      .actividadesPendientesProyecto(this.proyectoId)
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
      .actividadesRetrasadasProyecto(this.proyectoId)
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
  }

  cerrarNotificacionModal() {
    this.notificacionModalAbierto = false;
    this.notificacionCreada = {};
  }

  crearNotificacion() {
    this.notificacionCreada.fk_usuario = this.proyecto.pk_usuario;
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
