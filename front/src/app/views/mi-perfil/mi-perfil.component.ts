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
    const update: Partial<Traje> = {
      disponible: true,
      reservadoPor: null
    };

    this.service.updateTraje(this.urlTrajes + id, update).subscribe({
      next: () => {
        if (this.parent) {
          const url = `${this.urlPadres}${this.mainId}`;
          this.service.updatePadre2(url, { credito: this.parent.credito + 1 }).subscribe({
            next: () => {
              this.reservedTrajes = this.reservedTrajes.filter(t => t.id !== id);
              if (this.parent) {
                this.parent.credito += 1;
              }
              alert('Reserva cancelada y crédito devuelto correctamente.');
              // Recargar los trajes reservados después de cancelar
              this.loadReservedTrajes();
            },
            error: err => {
              console.error('Error actualizando crédito:', err);
              alert('Error al actualizar el crédito.');
            }
          });
        }
      },
      error: err => {
        console.error('Error cancelando reserva:', err);
        alert('Error al cancelar la reserva.');
      }
    });
  }

  public loadReservedTrajes(): void {
    this.service.getTrajes(this.urlTrajes).subscribe({
      next: (all: Traje[]) => {
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
      },
      error: err => console.error('Error cargando trajes:', err)
    });
  }

  public logout(): void {
    localStorage.clear();
    this.router.navigate(['/inicio']).then(() => location.reload());
  }
}
