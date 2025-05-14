import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../services/request.service';
import { Router } from '@angular/router';
import { Traje, Padre } from '../../models/response.interface';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [],
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css']
})
export class MiPerfilComponent implements OnInit {
  public parent: Padre | null = null;
  public reservedTrajes: Traje[] = [];

  public urlPadres = 'http://localhost:8001/api/padres/';
  public urlTrajes  = 'http://localhost:8001/api/trajes/';
  public mainId     = Number(localStorage.getItem('userId'));

  constructor( public service: RequestService, public router: Router ) {}

  public ngOnInit(): void {
    if (!this.mainId) {
      this.router.navigate(['login']);
      return;
    }

    this.service.getPadre(this.urlPadres + this.mainId).subscribe({
      next: (padre: Padre) => {
        this.parent = padre;
      },
      error: err => console.error('No se pudo cargar el padre:', err)
    });

  this.service.getTrajes(this.urlTrajes).subscribe({
    next: (all: Traje[]) => {
      console.log('Todos los trajes:', all);
      
      this.reservedTrajes = all
        .filter(t => {
          if (typeof t.reservadoPor === 'number') {
            return t.reservadoPor === this.mainId;
          } else if (t.reservadoPor && typeof t.reservadoPor === 'object') {
            return t.reservadoPor.id === this.mainId;
          }
          return false;
        })
        .map(t => {
          t.fechaIncorporacion = new Date(t.fechaIncorporacion)
            .toLocaleDateString('es-ES');
          return t;
        });
      console.log('Trajes reservados:', this.reservedTrajes);
    },
    error: err => console.error('Error cargando trajes:', err)
  });
  }

  public cancelTraje(id: number): void {
    this.service.deleteTraje(this.urlTrajes + id).subscribe({
      next: () => {
        this.reservedTrajes = this.reservedTrajes.filter(t => t.id !== id);
      },
      error: err => console.error('Error eliminando traje:', err)
    });
  }

  public logout(): void {
    localStorage.clear();
    this.router.navigate(['/inicio']).then(() => location.reload());
  }
}
