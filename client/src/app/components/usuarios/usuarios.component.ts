import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from 'src/app/services/usuario.service';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { Usuario } from 'src/app/models/usuario';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { EquipoAreaService } from 'src/app/services/equipo-area.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements OnInit {
  registroModalAbierto = false;
  modificacionModalAbierto = false;
  vistaModalAbierto = false;
  vistaDatos: any = [];
  usuarios: any = [];
  displayedColumns: string[] = [
    'Matricula',
    'Nombre',
    'Genero',
    'Rol',
    'Area',
    'Acciones',
  ];
  dataSource = new MatTableDataSource(this.usuarios);
  roles: any = [];
  areas: any = [];
  pk_usuario: any;
  email: any;
  usuarioCreado: Usuario = {};
  datosUsuario: any = [];

  botonCrearHabilitado: boolean = true;

  // Datos de la sesion
  datoSesion: any;
  rol: any = null;
  area: any = null;
  empresa: any = null;
  plan: any = null;

  constructor(
    private usuarioService: UsuarioService,
    private equipoAreaService: EquipoAreaService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthService
  ) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    // Validar si el usuario ha iniciado sesión
    this.datoSesion = this.authService.getUserData();
  
    if (this.datoSesion) {
      this.rol = this.datoSesion.fk_rol;
      this.area = this.datoSesion.fk_area;
      this.empresa = this.datoSesion.fk_empresa;
      this.plan = this.datoSesion.fk_suscripcion;
    }
  
    if (this.rol != null && this.rol != 4) {
      if (this.rol == 1 || this.rol == 2) {
        this.obtenerUsuarios();
      } else {
        this.obtenerUsuariosArea();
      }
    } else {
      this.router.navigate(['/403']);
      return;
    }
  
    forkJoin([
      this.usuarioService.obtenerRoles(),
      this.equipoAreaService.obtenerAreas(this.empresa),
    ]).subscribe(
      ([roles, areas]) => {
        this.roles = roles;
        this.areas = areas;
      },
      (error) => {
        console.error('Error al obtener datos:', error);
      }
    );
  }

  obtenerUsuarios() {
    this.usuarioService.obtenerUsuarios(this.empresa).subscribe(
      (res) => {
        this.usuarios = res;
        this.dataSource = new MatTableDataSource(this.usuarios);
        this.dataSource.paginator = this.paginator;
      },
      (err) => console.log(err)
    );
  }

  obtenerUsuariosArea() {
    this.usuarioService.obtenerUsuariosArea(this.area, this.empresa).subscribe(
      (res) => {
        this.usuarios = res;
        this.dataSource = new MatTableDataSource(this.usuarios);
        this.dataSource.paginator = this.paginator;
      },
      (err) => console.log(err)
    );
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  eliminarUsuario(pk_usuario: any) {
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
        this.usuarioService.eliminarUsuario(pk_usuario).subscribe(
          (res) => {
            this.toastr.success(
              'Se ha eliminado el empleado exitosamente',
              'Hecho',
              {
                timeOut: 3000,
              }
            );
            if (this.rol == 1 || this.rol == 2) {
              this.obtenerUsuarios();
            } else {
              this.obtenerUsuariosArea();
            }
          },
          (error) => {
            this.toastr.error(
              'Hubo un problema al eliminar el empleado',
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

  abrirRegistroModal() {
    this.registroModalAbierto = true;
    this.botonCrearHabilitado = true;
  }

  abrirModificacionModal(pk_usuario: any) {
    this.modificacionModalAbierto = true;
    this.pk_usuario = pk_usuario;
    this.usuarioService.verUsuario(pk_usuario).subscribe((res) => {
      this.datosUsuario = res;
      const fechaNacimiento = this.datosUsuario.fecha_nacimiento.toString();
      this.datosUsuario.fecha_nacimiento = fechaNacimiento.substring(0, 10);
    });
  }

  abrirVistaModal(pk_usuario: any) {
    this.vistaModalAbierto = true;
    this.usuarioService.obtenerUsuario(pk_usuario).subscribe((res) => {
      this.vistaDatos = res;
      const fechaNacimiento = this.vistaDatos.fecha_nacimiento.toString();
      this.vistaDatos.fecha_nacimiento = fechaNacimiento.substring(0, 10);
    });
  }

  cerrarVistaModal() {
    this.vistaModalAbierto = false;
  }

  cerrarRegistroModal() {
    this.registroModalAbierto = false;
    this.usuarioCreado = {};
  }

  cerrarModificacionModal() {
    this.modificacionModalAbierto = false;
  }

  crearUsuario() {
    // Validación del nombre completo del usuario
    if (!this.usuarioCreado || !this.usuarioCreado.nombre || !this.usuarioCreado.ape_paterno || !this.usuarioCreado.ape_materno || 
      this.usuarioCreado.nombre.length < 3 || this.usuarioCreado.ape_paterno.length < 3 || this.usuarioCreado.ape_materno.length < 3 ||
      this.usuarioCreado.nombre.length > 50 || this.usuarioCreado.ape_paterno.length > 50 || this.usuarioCreado.ape_materno.length > 50) {
        this.toastr.error('El nombre completo del usuario debe tener entre 3 y 50 caracteres por cada campo', 'Error', {timeOut: 3000});
        return;
    }

    // Validación del correo electrónico
    if (!this.usuarioCreado.email) {
      this.toastr.error('El correo electrónico es requerido', 'Error', {timeOut: 3000});
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.usuarioCreado.email)) {
        this.toastr.error('Ingrese un correo electrónico válido', 'Error', {timeOut: 3000});
        return;
    }

    // Validación del teléfono
    if (!this.usuarioCreado.telefono) {
      this.toastr.error('El teléfono es requerido', 'Error', {timeOut: 3000});
      return;
    }

    const telRegex = /^\d{10}$/;
    if (!telRegex.test(this.usuarioCreado.telefono)) {
        this.toastr.error('Ingrese un teléfono válido (10 dígitos numéricos)', 'Error', {timeOut: 3000});
        return;
    }

    // Validación del género
    if (!this.usuarioCreado.genero) {
      this.toastr.error('Debe seleccionar un género', 'Error', {timeOut: 3000});
      return;
    }

    // Validación de la fecha de nacimiento
    if (!this.usuarioCreado.fecha_nacimiento) {
      this.toastr.error('La fecha de nacimiento es requerida', 'Error', {timeOut: 3000});
      return;
    }

    // Validación de la fecha de nacimiento
    const fechaNacimiento = new Date(this.usuarioCreado.fecha_nacimiento);
    const fechaActual = new Date();
    if (fechaNacimiento >= fechaActual) {
        this.toastr.error('La fecha de nacimiento debe ser anterior a la fecha actual', 'Error', {timeOut: 3000});
        return;
    }

    // Validación del rol
    if (!this.usuarioCreado.fk_rol) {
      this.toastr.error('Debe seleccionar un rol para el usuario', 'Error', {timeOut: 3000});
      return;
    }

    // Validación del área
    if (!this.usuarioCreado.fk_area && this.usuarioCreado.fk_rol != 1) {
      this.toastr.error('Debe seleccionar un área para el usuario', 'Error', {timeOut: 3000});
      return;
    }

    // Validación del rol
    if (!this.usuarioCreado ||  this.usuarioCreado.fk_rol == 1) {
      this.usuarioCreado.fk_area = null;
    }

    // Validación de la contraseña (aquí debes implementar tu lógica para definir qué es una contraseña segura)
    if (!this.usuarioCreado || !this.usuarioCreado.password || this.usuarioCreado.password.length < 8 || this.usuarioCreado.password.length > 16) {
        this.toastr.error('La contraseña debe tener entre 8 y 16 caractéres', 'Error', {timeOut: 3000});
        return;
    }

    this.botonCrearHabilitado = false
    this.usuarioService.validarEmailTel(this.usuarioCreado).subscribe(res => {
      this.usuarioCreado.fk_empresa = this.empresa;
      this.usuarioService.registrarUsuario(this.usuarioCreado).subscribe(
        (res) => {
          this.toastr.success(
            'Los datos del empleado se guardaron exitosamente',
            'Éxito',
            { timeOut: 3000 }
          );
          this.registroModalAbierto = false;
          this.usuarioCreado = {};
          this.obtenerUsuarios()
        },
        (err) => {
          this.toastr.error(
            'No se pudieron guardar los datos del empleado',
            'Error',
            { timeOut: 3000 }
          );
        }
      );
    },err => {
      console.log(err);
      this.toastr.error(err.error.message,'Error',{timeOut: 3000})
      this.botonCrearHabilitado = true
      return;
    })
  }

  modificarUsuario() {
    // Validación del nombre completo del usuario
    if (!this.datosUsuario || !this.datosUsuario.nombre || !this.datosUsuario.ape_paterno || !this.datosUsuario.ape_materno || 
      this.datosUsuario.nombre.length < 3 || this.datosUsuario.ape_paterno.length < 3 || this.datosUsuario.ape_materno.length < 3 ||
      this.datosUsuario.nombre.length > 50 || this.datosUsuario.ape_paterno.length > 50 || this.datosUsuario.ape_materno.length > 50) {
        this.toastr.error('El nombre completo del usuario debe tener entre 3 y 50 caracteres por cada campo', 'Error', {timeOut: 3000});
        return;
    }

    // Validación del correo electrónico
    if (!this.datosUsuario.email) {
      this.toastr.error('El correo electrónico es requerido', 'Error', {timeOut: 3000});
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.datosUsuario.email)) {
        this.toastr.error('Ingrese un correo electrónico válido', 'Error', {timeOut: 3000});
        return;
    }

    // Validación del teléfono
    if (!this.datosUsuario.telefono) {
      this.toastr.error('El teléfono es requerido', 'Error', {timeOut: 3000});
      return;
    }

    const telRegex = /^\d{10}$/;
    if (!telRegex.test(this.datosUsuario.telefono)) {
        this.toastr.error('Ingrese un teléfono válido (10 dígitos numéricos)', 'Error', {timeOut: 3000});
        return;
    }

    // Validación del género
    if (!this.datosUsuario.genero) {
      this.toastr.error('Debe seleccionar un género', 'Error', {timeOut: 3000});
      return;
    }

    // Validación de la fecha de nacimiento
    if (!this.datosUsuario.fecha_nacimiento) {
      this.toastr.error('La fecha de nacimiento es requerida', 'Error', {timeOut: 3000});
      return;
    }

    // Validación de la fecha de nacimiento
    const fechaNacimiento = new Date(this.datosUsuario.fecha_nacimiento);
    const fechaActual = new Date();
    if (fechaNacimiento >= fechaActual) {
        this.toastr.error('La fecha de nacimiento debe ser anterior a la fecha actual', 'Error', {timeOut: 3000});
        return;
    }

    // Validación del rol
    if (!this.datosUsuario.fk_rol) {
      this.toastr.error('Debe seleccionar un rol para el usuario', 'Error', {timeOut: 3000});
      return;
    }

    // Validación del área
    if (!this.datosUsuario.fk_area && this.datosUsuario.fk_rol != 1) {
      this.toastr.error('Debe seleccionar un área para el usuario', 'Error', {timeOut: 3000});
      return;
    }

    // Validación del rol
    if (!this.datosUsuario ||  this.datosUsuario.fk_rol == 1) {
      this.datosUsuario.fk_area = null;
    }

    this.usuarioService
      .modificarUsuario(this.pk_usuario, this.datosUsuario)
      .subscribe(
        (res) => {
          this.toastr.success(
            'Se modificaron los datos del empleado exitosamente',
            'Éxito',
            { timeOut: 3000 }
          );
          this.modificacionModalAbierto = false;
          this.datosUsuario = {};
          this.obtenerUsuarios()
        },
        (err) => {
          this.toastr.warning(
            'No se pudieron actualizar los datos del empleado',
            'Error',
            {
              timeOut: 3000,
            }
          );
          console.log(err);
        }
      );
  }

  verEstadistica(pk_empleado: any) {
    window.location.href = '/estadistica-empleado/' + pk_empleado;
  }
}
