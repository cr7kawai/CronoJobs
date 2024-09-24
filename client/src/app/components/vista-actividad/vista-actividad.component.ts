import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Comentario } from 'src/app/models/comentario';
import { ActividadService } from 'src/app/services/actividad.service';
import { AuthService } from 'src/app/services/auth.service';
import { ProyectoService } from 'src/app/services/proyecto.service';

@Component({
  selector: 'app-vista-actividad',
  templateUrl: './vista-actividad.component.html',
  styleUrls: ['./vista-actividad.component.css']
})
export class VistaActividadComponent implements OnInit{

  comentarioModalAbierto = false;
  actividad: any = [];
  comentarios: any = [];
  pk_proyecto: any;
  pk_actividad: any;
  comentarioCreado: Comentario ={};

  // Datos de la sesión
  datosUsuario: any;
  rol: any = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private actividadService: ActividadService, 
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService
  ){}

  ngOnInit(): void {
    // Validar si el usuario ha iniciado sesión
    this.datosUsuario = this.authService.getUserData();
    if (this.datosUsuario) {
      this.rol = this.datosUsuario.fk_rol;
    }else{
      this.router.navigate(['/403']);
      return;
    }

    this.pk_proyecto = this.activatedRoute.snapshot.paramMap.get('id_proyecto');
    this.pk_actividad = this.activatedRoute.snapshot.paramMap.get('id_actividad');
    this.obtenerActividad()
    this.obtenerComentarios()
  }

  obtenerActividad(){
    this.actividadService.verActividad(this.pk_actividad).subscribe(res =>{
      this.actividad = res;
      console.log(this.actividad)
    },err => console.log(err))
  }

  culminarActividad(){
    this.actividadService.actualizarEstadoActividad(this.pk_actividad, this.actividad).subscribe(res => {
      this.toastr.success('Se culminó la actividad de manera correcta','Éxito',{timeOut: 3000})
      this.obtenerActividad();
    },err => {this.toastr.error('No se pudo culminar la actividad','Error',{timeOut: 3000})})
  }

  obtenerComentarios(){
    this.actividadService.obtenerComentariosActividad(this.pk_actividad).subscribe(res => {
      this.comentarios = res
      console.log(this.comentarios)
    },err => console.log(err)
    )
  }

  abrirComentarioModal(){
    this.comentarioModalAbierto = true;
  }

  cerrarComentarioModal(){
    this.comentarioModalAbierto = false;
    this.comentarioCreado = {}
  }

  agregarComentario(){
    this.comentarioCreado.fk_actividad = this.pk_actividad
    const fecha = new Date();
    this.comentarioCreado.fecha = fecha.toISOString().slice(0,10)
    this.actividadService.registrarComentarioActividad(this.comentarioCreado).subscribe(res => {
      this.toastr.success('El comentario ha sido agregado exitosamente','Éxito',{timeOut: 3000})
      this.comentarioModalAbierto = false;
      this.obtenerComentarios();
    },err => {
      this.toastr.error('No se pudo agregar el comentario','Error',{timeOut: 3000})
    })
  }
}
