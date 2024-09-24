import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { EstadisticaEmpleadoComponent } from './components/estadistica-empleado/estadistica-empleado.component';
import { EstadisticaProyectoComponent } from './components/estadistica-proyecto/estadistica-proyecto.component';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import {
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
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
import { CustomPaginatorIntl } from './services/customPaginatorIntl.service';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { FooterComponent } from './footer/footer.component';
import { MatCardModule } from '@angular/material/card';
import { EquiposAreasComponent } from './components/equipos-areas/equipos-areas.component';
import { RegistroEmpresaComponent } from './components/registro-empresa/registro-empresa.component';
import { MapaComponent } from './components/mapa/mapa.component';
import { PoliticaPrivacidadComponent } from './components/politica-privacidad/politica-privacidad.component';
import { MatStepperModule } from '@angular/material/stepper';
import { BuscadorComponent } from './components/buscador/buscador.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { MatMenuModule } from '@angular/material/menu';

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
    Error403Component,
    BreadcrumbComponent,
    FooterComponent,
    EquiposAreasComponent,
    RegistroEmpresaComponent,
    MapaComponent,
    PoliticaPrivacidadComponent,
    BuscadorComponent
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
    MatSelectModule,
    MatCardModule,
    MatStepperModule,
    MatInputModule,
    NgxCaptchaModule,
    MatMenuModule
  ],
  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: CustomPaginatorIntl,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
