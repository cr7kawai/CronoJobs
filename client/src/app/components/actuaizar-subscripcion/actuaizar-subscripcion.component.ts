import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Empresa } from 'src/app/models/empresa';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { LoginService } from 'src/app/services/login.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-actuaizar-subscripcion',
  templateUrl: './actuaizar-subscripcion.component.html',
  styleUrls: ['./actuaizar-subscripcion.component.css']
})
export class ActuaizarSubscripcionComponent implements OnInit {

  siteKey: string = '6LeHRbgpAAAAAGyyf-0hk32Bq05HpoKUItQUOqaQ';
  
  usuario: Usuario = {};
  empresa: Empresa = {};

  captchaDatos: boolean = false;
  empresaDatos: boolean = false;
  usuarioDatos: boolean = false;
  pagoDatos: boolean = false;

  precioPlan: any = null;
  tipoPlan: any = null;

  resultado: any = [];

  // Datos de la sesión
  datoSesion: any;
  pk_usuario: any;
  pk_empresa: any;

  constructor(
    private http: HttpClient, 
    private usuarioService: UsuarioService, 
    private empresaService: EmpresaService, 
    private loginService: LoginService, 
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.datoSesion = this.authService.getUserData();
    if(!this.datoSesion){
      this.router.navigate(['/']);
      return;
    }else{
      this.pk_usuario = this.datoSesion.pk_usuario;
      this.pk_empresa = this.datoSesion.fk_empresa;
    }

    this.usuarioService.obtenerCredenciales(this.pk_usuario).subscribe(res =>{
      this.usuario = res;
    })

    //PayPal
    if(this.precioPlan > 0){
      this.pagoDatos = true;
      setTimeout(() => {
        paypal.Buttons({
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: this.precioPlan
                }
              }]
            });
          },
          onApprove: (data: any, actions: any) => {
            return actions.order.capture().then((details: any) => {
              this.actualizarDatos();
            });
          },
          onError: (err: any) => {
            console.log(err)
            this.toastr.error('No se ha podido procesar el pago correctamente', 'Error', {timeOut: 3000});
          }
        }).render('#paypal-button-container');
      }, 1000);
    }
  }

  avanzarStepper(stepper: MatStepper) {
      stepper.next();
  }

  valoresPago(precioPlan: any, tipoPlan: any, pk_plan: any, stepper: MatStepper){
    this.tipoPlan = tipoPlan;
    this.precioPlan = precioPlan;
    this.empresa.fk_suscripcion = pk_plan;
    this.avanzarStepper(stepper);
    console.log(this.empresa)

    if(this.precioPlan > 0 && this.pagoDatos == false){
      this.ngOnInit()
    }
  }

  actualizarDatos(){
    const fecha = new Date();
    this.empresa.fecha_suscripcion = fecha.toISOString().slice(0,10);
    this.empresaService.modificarEmpresa(this.pk_empresa, this.empresa).subscribe(res =>{
      this.login()
    })
  }

  login() {
    this.authService.logout();

    this.loginService.inicio_sesion(this.usuario).subscribe(
      (res: any) => {
        console.log(res)
        const token = res.token;

        localStorage.setItem('token', token);
        
        window.location.href = '/';
      },
      (err: any) => {
        this.toastr.warning(
          'Email o contraseña incorrectos',
          'Acceso denegado',
          {
            timeOut: 3000,
          }
        );
      }
    );
  }
}
