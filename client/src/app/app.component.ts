import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'CronoJobs';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Verificar si el token ha caducado al iniciar la aplicación
    this.checkTokenExpiration();
  }

  checkTokenExpiration(): void {
    const token = this.authService.getToken();

    if (token) {
      const isTokenExpired = this.authService.isTokenExpired();

      if (isTokenExpired) {
        this.authService.logout();
      }
    }
  }
}