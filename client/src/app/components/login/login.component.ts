import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario';
import { LoginService } from 'src/app/services/login.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  constructor(private loginService: LoginService, private toastr: ToastrService){ }

  resultado: any = [];

  usuario: Usuario = {
    email: '',
    password: ''
  }

  ngOnInit(): void {
    delete this.usuario.email;
    delete this.usuario.password;
    console.log(sessionStorage);
  }

  login(){
    this.loginService.login(this.usuario).subscribe(res =>{
      this.resultado = res;
      sessionStorage.setItem('userData', JSON.stringify(this.resultado.userData));
      if(this.resultado.userData.fk_rol == 1){
        window.location.href = '/usuarios'
      }else if(this.resultado.userData.fk_rol == 2){
        window.location.href = '/usuarios'
      }else if(this.resultado.userData.fk_rol == 3){
        window.location.href = '/proyectos'
      }else if(this.resultado.userData.fk_rol == 4){
        window.location.href = '/notificaciones'
      }
    },
    err => {
      this.toastr.warning('Email o contraseña incorrectos', 'Acceso denegado', {
        timeOut: 3000
      });
    }
    )
  }
}
