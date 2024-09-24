import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RegistroResponse } from 'src/app/models/IRegistroResponse.interface';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { LoginService } from 'src/app/services/login.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-cambiar-password',
  templateUrl: './cambiar-password.component.html',
  styleUrls: ['./cambiar-password.component.css']
})
export class CambiarPasswordComponent implements OnInit {

  siteKey: string = '6LeHRbgpAAAAAGyyf-0hk32Bq05HpoKUItQUOqaQ';

  captchaDatos: boolean = false;
  emailDatos: boolean = false;
  codigoDatos: boolean = false;

  email: string = '';
  codigoRecibido: string = '';
  password: string = '';
  usuario: Usuario = {};

  codigo: string = '';
  resultado: any = [];

  // Datos de la sesion
  datoSesion: any;

  constructor(
    private http: HttpClient, 
    private usuarioService: UsuarioService,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService
  ) { }
  ngOnInit(): void {
    // Obtener datos del inicio de sesión
    this.datoSesion = this.authService.getUserData();

    if (this.datoSesion) {
      this.router.navigate(['/']);
      return;
    }
  }

  // Para continuar el captcha
  handleCaptchaResponse(event: any, stepper: MatStepper) {
    if (event) {
      this.captchaDatos = true;
      setTimeout(() => {
        this.avanzarStepper(stepper);
      }, 100);
    }
  }

  avanzarStepper(stepper: MatStepper) {
      stepper.next();
  }

  envioEmail(stepper: MatStepper) {

    // Validación del correo electrónico
    if (!this.email) {
      this.toastr.error('El correo electrónico es requerido', 'Error', {timeOut: 3000});
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
        this.toastr.error('Ingrese un correo electrónico válido', 'Error', {timeOut: 3000});
        return;
    }

    this.usuarioService.obtenerUsuarioEmail(this.email).subscribe(res=>{
      this.usuario = res;
      this.usuarioService.enviarEmailConfirmacion(this.email).subscribe((res: RegistroResponse) =>{
        this.emailDatos = true;
        this.codigo = res.insertedId;
        setTimeout(() => {
          this.avanzarStepper(stepper);
        }, 100);
      },err =>{
        this.toastr.error('No se ha podido enviar el correo, asegúrese de que este exista', 'Error', {timeOut: 3000});
          return;
      })
    },err =>{
      this.toastr.error('No se ha registrado este correo en la aplicación', 'Error', {timeOut: 3000});
        return;
    })
  }

  validarCodigo(stepper: MatStepper){
    if(this.codigoRecibido == this.codigo){
      this.codigoDatos = true;
      this.codigo = '';
      setTimeout(() => {
        this.avanzarStepper(stepper);
      }, 100);
    }else{
      this.toastr.error('El código no coincide, asegúrese de que sea el correcto', 'Error', {timeOut: 3000});
      return;
    }
  }

  cambiarPassword(){
    if (!this.password || this.password.length < 8 || this.password.length > 16) {
      this.toastr.error('La contraseña debe tener entre 8 y 16 caractéres', 'Error', {timeOut: 3000});
      return;
    }

    this.usuario.password = this.password;
    this.usuarioService.modificarUsuario(this.usuario.pk_usuario, this.usuario).subscribe(res=>{
      this.toastr.success('Se ha cambiado la contraseña correctamente', 'Exito', {timeOut: 3000});
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    })
  }
}
