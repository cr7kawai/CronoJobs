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

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements OnInit {
  registroModalAbierto = false;
  passwordModalAbierto = false;
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
  usuarioPassword: Usuario = {
    password: '',
  };
  usuarioCreado: Usuario = {};
  datosUsuario: any = [];

  // Identificadores del usuario
  datoSesion: any = [];
  datoSesionObject: any = [];
  rol: any = null;
  area: any = null;
  empresa: any = null;
  plan: any = null;

  constructor(
    private usuarioService: UsuarioService,
    private equipoAreaService: EquipoAreaService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private router: Router
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

        this.filtrarRoles();
      },
      (error) => {
        console.error('Error al obtener datos:', error);
      }
    );
  }
  
  filtrarRoles(){
    this.usuarioService.obtenerRoles().subscribe(res => {
      this.roles = res

      const contadorRoles: Record<string, number> = this.usuarios.reduce((contador: any, usuario: any) => {
        const rol = usuario.rol;
        contador[rol] = (contador[rol] || 0) + 1;
        return contador;
      }, {});
  
  
      const rolesFiltrados = this.roles.filter((rol: any) => {
        switch (rol.nombre) {
          case 'Administrador':
            return contadorRoles['Administrador'] < 2;
          case 'Supervisor':
            if (this.plan === 1) {
              return contadorRoles['Supervisor'] < 2;
            }
            return true;
          case 'Empleado':
            if (this.plan === 1) {
              return contadorRoles['Empleado'] < 8;
            }
            return true;
          default:
            return true;
        }
      });
      
      // Asignar la lista filtrada de roles de vuelta a this.roles
      this.roles = rolesFiltrados;
    });
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
            this.filtrarRoles()
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

  abrirPasswordModal(pk_usuario: any, email: any) {
    this.passwordModalAbierto = true;
    this.pk_usuario = pk_usuario;
    this.email = email;
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

  cerrarPasswordModal() {
    this.passwordModalAbierto = false;
  }

  crearUsuario() {
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
        this.filtrarRoles()
      },
      (err) => {
        this.toastr.error(
          'No se pudieron guardar los datos del empleado',
          'Error',
          { timeOut: 3000 }
        );
      }
    );
  }

  modificarUsuario() {
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
          this.filtrarRoles();
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

  cambiarPassword() {
    this.usuarioService
      .cambiarContrasena(this.pk_usuario, this.email, this.usuarioPassword)
      .subscribe(
        (res) => {
          this.passwordModalAbierto = false;
          this.toastr.success(
            'La contraseña se actualizó exitosamente',
            'Éxito',
            { timeOut: 3000 }
          );
          this.usuarioPassword.password = '';
        },
        (err) => {
          this.toastr.warning('No se pudo actualizar la contraseña', 'Error', {
            timeOut: 3000,
          });
        }
      );
  }

  verEstadistica(pk_empleado: any) {
    window.location.href = '/estadistica-empleado/' + pk_empleado;
  }
}
