import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { EstadisticaProyectoComponent } from './components/estadistica-proyecto/estadistica-proyecto.component';
import { EstadisticaEmpleadoComponent } from './components/estadistica-empleado/estadistica-empleado.component';
import { ProyectosComponent } from './components/proyectos/proyectos.component';
import { VistaProyectoComponent } from './components/vista-proyecto/vista-proyecto.component';
import { ActividadesComponent } from './components/actividades/actividades.component';
import { VistaActividadComponent } from './components/vista-actividad/vista-actividad.component';
import { NotificacionesComponent } from './components/notificaciones/notificaciones.component';
import { HomeComponent } from './components/home/home.component';
import { Error404Component } from './error/error404/error404.component';
import { Error403Component } from './error/error403/error403.component';
import { EquiposAreasComponent } from './components/equipos-areas/equipos-areas.component';
import { RegistroEmpresaComponent } from './components/registro-empresa/registro-empresa.component';
import { PoliticaPrivacidadComponent } from './components/politica-privacidad/politica-privacidad.component';
import { MapaComponent } from './components/mapa/mapa.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'registro',
    component: RegistroEmpresaComponent
  },
  {
    path: 'politica-privacidad',
    component: PoliticaPrivacidadComponent
  },
  {
    path: 'mapa-del-sitio',
    component: MapaComponent
  },
  {
    path: 'estadistica-proyecto/:id_proyecto',
    component: EstadisticaProyectoComponent
  },
  {
    path: 'estadistica-empleado/:id_usuario',
    component: EstadisticaEmpleadoComponent
  },
  {
    path: 'equipo-area',
    component: EquiposAreasComponent
  },
  {
    path: 'usuarios',
    component: UsuariosComponent
  },
  {
    path: 'proyectos',
    component: ProyectosComponent
  },
  {
    path: 'vista-proyecto/:id_proyecto',
    component: VistaProyectoComponent
  },
  {
    path: 'actividades/:id_proyecto',
    component: ActividadesComponent
  },
  {
    path: 'vista-actividad/:id_proyecto/:id_actividad',
    component: VistaActividadComponent
  },
  {
    path: 'notificaciones',
    component: NotificacionesComponent
  },
  {
    path: '403',
    component: Error403Component
  },
  {
    path: '404',
    component: Error404Component
  },
  {
    path: '**',
    redirectTo: '/404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
