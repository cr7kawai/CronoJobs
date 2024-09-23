import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { EstadisticaEmpleadoComponent } from './components/estadistica-empleado/estadistica-empleado.component';
import { EstadisticaProyectoComponent } from './components/estadistica-proyecto/estadistica-proyecto.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MenuComponent } from './menu/menu.component';
import { ProyectosComponent } from './components/proyectos/proyectos.component';
import { VistaProyectoComponent } from './components/vista-proyecto/vista-proyecto.component';
import { VistaActividadComponent } from './components/vista-actividad/vista-actividad.component';
import { ActividadesComponent } from './components/actividades/actividades.component';
import { NotificacionesComponent } from './components/notificaciones/notificaciones.component';
import { HomeComponent } from './components/home/home.component';
import { Error403Component } from './error/error403/error403.component';
import { Error404Component } from './error/error404/error404.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    EstadisticaEmpleadoComponent,
    EstadisticaProyectoComponent,
    UsuariosComponent,
    MenuComponent,
    ProyectosComponent,
    VistaProyectoComponent,
    VistaActividadComponent,
    ActividadesComponent,
    NotificacionesComponent,
    HomeComponent,
    Error404Component, 
    Error403Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ChartModule,
    FormsModule,
    ToastrModule.forRoot(),
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    MatGridListModule,
    MatDialogModule,
    MatOptionModule,
    MatSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
