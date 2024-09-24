import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RegistroResponse } from 'src/app/models/IRegistroResponse.interface';
import { Empresa } from 'src/app/models/empresa';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { LoginService } from 'src/app/services/login.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-registro-empresa',
  templateUrl: './registro-empresa.component.html',
  styleUrls: ['./registro-empresa.component.css']
})

export class RegistroEmpresaComponent implements OnInit {

  siteKey: string = '6LeHRbgpAAAAAGyyf-0hk32Bq05HpoKUItQUOqaQ';

  paises: any[] = [];
  estados: any[] = [];
  ciudades: any[] = [];
  
  selectedPais: string = '';
  selectedEstado: string = '';

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
    if(this.datoSesion){
      this.router.navigate(['/']);
      return;
    }


    //Geonames
    this.http.get('http://api.geonames.org/countryInfoJSON?username=CronoJobs')
      .subscribe((data: any) => {
        this.paises = data.geonames;
      }
    );

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
              this.registroDatos()
            });
          },
          onError: (err: any) => {
            console.log(err)
            this.toastr.error('No se ha podido procesar el pago correctamente', 'Error', {timeOut: 3000});
          }
        }).render('#paypal-button-container');
      }, 1000); // Esperar 1 segundo
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

  onStepSelectionChange(event: any) {
    const selectedStepIndex = event.selectedIndex;
    const previousStepIndex = event.previouslySelectedIndex;

    if (selectedStepIndex < previousStepIndex) {
      if(selectedStepIndex == 1){
        this.usuarioDatos = false;
        this.empresaDatos = false;
      }
      if(selectedStepIndex == 2){
        this.empresaDatos = false;
      }
    }
  }

  onSelectPais(event: Event) {
    const paisCode = (event.target as HTMLInputElement).value;
    this.http.get(`http://api.geonames.org/childrenJSON?geonameId=${paisCode}&username=CronoJobs`)
      .subscribe((data: any) => {
        this.estados = data.geonames;
        this.selectedPais = this.estados[0].countryName;
        console.log(this.selectedPais);
      });
  }

  onSelectEstado(event: Event) {
    const estadoCode = (event.target as HTMLInputElement).value;
    this.http.get(`http://api.geonames.org/childrenJSON?geonameId=${estadoCode}&username=CronoJobs`)
      .subscribe((data: any) => {
        this.ciudades = data.geonames;
        this.selectedEstado = this.ciudades[0].name;
      });
  }

  validarDatosEmpresa(stepper: MatStepper){
    this.usuarioDatos = false;
    // Validación del nombre de la empresa
    if (!this.empresa || !this.empresa.nombre || this.empresa.nombre.length < 2 || this.empresa.nombre.length > 50) {
      this.toastr.error('El nombre de la empresa debe tener entre 2 y 50 caractéres', 'Error', {timeOut: 3000});
      return;
    }

    // Validación del nombre completo del usuario
    if (!this.usuario || !this.usuario.nombre || !this.usuario.ape_paterno || !this.usuario.ape_materno || 
      this.usuario.nombre.length < 3 || this.usuario.ape_paterno.length < 3 || this.usuario.ape_materno.length < 3 ||
      this.usuario.nombre.length > 50 || this.usuario.ape_paterno.length > 50 || this.usuario.ape_materno.length > 50) {
        this.toastr.error('El nombre completo del usuario debe tener entre 3 y 50 caracteres por cada campo', 'Error', {timeOut: 3000});
        return;
    }

    // Validación del género
    if (!this.usuario.genero) {
        this.toastr.error('Debe seleccionar un género', 'Error', {timeOut: 3000});
        return;
    }

    // Validación de la fecha de nacimiento
    if (!this.usuario.fecha_nacimiento) {
      this.toastr.error('La fecha de nacimiento es requerida', 'Error', {timeOut: 3000});
      return;
    }

    // Validación de la fecha de nacimiento
    const fechaNacimiento = new Date(this.usuario.fecha_nacimiento);
    const fechaActual = new Date();
    if (fechaNacimiento >= fechaActual) {
        this.toastr.error('La fecha de nacimiento debe ser anterior a la fecha actual', 'Error', {timeOut: 3000});
        return;
    }

    // Validación del correo electrónico
    if (!this.usuario.email) {
      this.toastr.error('El correo electrónico es requerido', 'Error', {timeOut: 3000});
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.usuario.email)) {
        this.toastr.error('Ingrese un correo electrónico válido', 'Error', {timeOut: 3000});
        return;
    }

    // Validación del teléfono
    if (!this.usuario.telefono) {
      this.toastr.error('El teléfono es requerido', 'Error', {timeOut: 3000});
      return;
    }

    const telRegex = /^\d{10}$/;
    if (!telRegex.test(this.usuario.telefono)) {
        this.toastr.error('Ingrese un teléfono válido (10 dígitos numéricos)', 'Error', {timeOut: 3000});
        return;
    }

    // Validación de la contraseña (aquí debes implementar tu lógica para definir qué es una contraseña segura)
    if (!this.usuario || !this.usuario.password || this.usuario.password.length < 8 || this.usuario.password.length > 16) {
        this.toastr.error('La contraseña debe tener entre 8 y 16 caractéres', 'Error', {timeOut: 3000});
        return;
    }

    this.usuarioService.validarEmailTel(this.usuario).subscribe(res => {
      this.avanzarStepper(stepper);
    },
      err => {
      console.log(err);
      this.toastr.error(err.error.message,'Error',{timeOut: 3000})
      return;
    })
    this.usuarioDatos = true;
  }

  validarDireccion(stepper: MatStepper){
    this.empresaDatos = false

    // Validación del país
    if (!this.empresa.pais) {
      this.toastr.error('Debe seleccionar un país', 'Error', { timeOut: 3000 });
      return;
    }

    // Validación del código postal
    const cpRegex = /^\d{3,10}$/;
    if (!this.empresa.cp || !cpRegex.test(this.empresa.cp)) {
        this.toastr.error('Ingrese un código postal válido (entre 3 y 10 dígitos numéricos)', 'Error', { timeOut: 3000 });
        return;
    }

    // Validación del estado
    if (!this.empresa.estado) {
      this.toastr.error('Debe seleccionar un estado/provincia/región', 'Error', { timeOut: 3000 });
      return;
    }

    // Validación de la ciudad
    if (!this.empresa.ciudad) {
        this.toastr.error('Debe seleccionar una ciudad', 'Error', { timeOut: 3000 });
        return;
    }
    
    // Validación de la colonia
    if (!this.empresa.colonia || this.empresa.colonia.length < 3 || this.empresa.colonia.length > 50) {
      this.toastr.error('La colonia debe tener entre 3 y 50 caracteres', 'Error', { timeOut: 3000 });
      return;
    }

    // Validación de la calle
    if (!this.empresa.calle || this.empresa.calle.length < 3 || this.empresa.calle.length > 50) {
      this.toastr.error('La calle debe tener entre 3 y 50 caracteres', 'Error', { timeOut: 3000 });
      return;
    }

    // Validación del número
    if (!this.empresa.numero || this.empresa.numero.length < 1) {
        this.toastr.error('El número debe de tener al menos un dígito', 'Error', { timeOut: 3000 });
        return;
    }

    this.empresaDatos = true;
    setTimeout(() => {
      this.avanzarStepper(stepper);
    }, 100);
  }

  avanzarStepper(stepper: MatStepper) {
      stepper.next();
  }

  valoresPago(precioPlan: any, tipoPlan: any, pk_plan: any, stepper: MatStepper){
    if(this.usuarioDatos == false || this.empresaDatos == false){
      this.tipoPlan = null;
      this.precioPlan = null;
      this.empresa.fk_suscripcion = 0;
      return;
    }

    if(this.usuarioDatos == true && this.empresaDatos == true){
      this.tipoPlan = tipoPlan;
      this.precioPlan = precioPlan;
      this.empresa.fk_suscripcion = pk_plan;
      this.avanzarStepper(stepper)
    }

    if(this.precioPlan == 0){
      this.pagoDatos = false
    }

    if(this.precioPlan > 0 && this.pagoDatos == false){
      this.ngOnInit()
    }
  }

  registroDatos(){
    const fecha = new Date();
    this.empresa.fecha_suscripcion = fecha.toISOString().slice(0,10);
    this.usuario.fk_rol = 2;
    this.empresa.pais = this.selectedPais;
    this.empresa.estado = this.selectedEstado;

    this.empresaService.registrarEmpresa(this.empresa).subscribe((res: RegistroResponse) => {
      this.usuario.fk_empresa = res.insertedId;
      this.usuarioService.registrarUsuario(this.usuario).subscribe(res =>{
        this.login()
      },err =>{
        this.toastr.error('No se pudieron registrar los datos correctamente, por favor comuníquese con nosotros','Error',{timeOut: 5000})
      })
    })
  }

  login() {
    this.loginService.inicio_sesion(this.usuario).subscribe(
      (res: any) => {
        console.log(res)
        const token = res.token;

        localStorage.setItem('token', token);
        
        window.location.href = '/equipo-area';
      },
      (err) => {
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
