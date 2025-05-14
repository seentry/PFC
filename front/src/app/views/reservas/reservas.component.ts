import { Component } from '@angular/core';
import { RequestService } from '../../services/request.service';
import { Traje, Padre } from '../../models/response.interface';
import { CommonModule } from '@angular/common';
import { CardTrajeComponent } from '../../components/card-traje/card-traje.component';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, CardTrajeComponent, HttpClientModule],
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent {
  public trajes: Traje[] = [];
  public trajesPaginados: Traje[] = [];
  public padres: Padre[] = [];
  public currentPage = 1;
  public itemsPerPage = 6;
  public apiUrlBase = 'http://localhost:8001/api';
  public apiUrlTrajes = `${this.apiUrlBase}/trajes`;
  public apiUrlPadres = `${this.apiUrlBase}/padres`;

  public userId = Number(localStorage.getItem('userId'));

  public currentParent!: Padre;

  constructor(public service: RequestService, private router: Router) {}

  ngOnInit(): void {
    if (!this.userId) {
      alert('Debes iniciar sesión para ver reservas');
      this.router.navigate(['/login']);
      return;
    }

    this.service.getPadre(`${this.apiUrlPadres}/${this.userId}`)
    .subscribe({
      next: p => {
        this.currentParent = p;
        this.getTrajesDisponibles();
      },
      error: err => {
        console.error('Error al cargar padre:', err);
        alert('No se pudo cargar tu perfil.');
      }
    });
  }

  public getTrajesDisponibles(): void {
    this.service.getTrajes(this.apiUrlTrajes).subscribe({
      next: all => {
        this.trajes = all.filter(t => t.disponible);
        this.actualizarPaginacion();
      },
      error: err => {
        console.error('Error al cargar trajes:', err);
        alert('No se pudieron cargar los trajes disponibles.');
      }
    });
  }

  public getPadres(): void {
    this.service.getPadres(this.apiUrlPadres).subscribe({
      next: (list: Padre[]) => {
        console.log('Padres recibidos:', list);
        this.padres = list;
      },
      error: err => {
        console.error('Error al cargar padres:', err);
        alert('No se pudieron cargar los padres.');
      }
    });
  }

  public reservarTraje(id: number): void {
    if (!this.userId) {
      alert('Debes iniciar sesión para reservar');
      return;
    }
  
    this.service.getPadre(`${this.apiUrlPadres}/${this.userId}`).subscribe({
      next: (padre: Padre) => {
        if (padre.credito <= -1) {
          alert('No tienes créditos suficientes para reservar.');
          return;
        }
        const url = `${this.apiUrlTrajes}/${id}`;
        const update: Partial<Traje> = {
          disponible: false,
          reservadoPor: this.userId
        };
  
        this.service.updateTraje(url, update).subscribe({
          next: updated => {
            this.restarCreditoPadre(padre.credito);
            alert(`Has reservado el traje ${id} correctamente.`);
            this.router.navigate(['/perfil']);
          },
          error: err => {
            console.error('Error al reservar traje:', err);
            alert('No se pudo reservar el traje.');
          }
        });
      },
      error: err => {
        console.error('Error al obtener datos del padre:', err);
        alert('Error al procesar la reserva.');
      }
    });
  }

  //resta credito
  private restarCreditoPadre(creditoActual: number): void {
    const url = `${this.apiUrlPadres}/${this.userId}`;
    this.service.updatePadre2(url, { credito: creditoActual - 1 }).subscribe({
      next: () => console.log('Crédito restado'),
      error: err => console.error('Error restando crédito', err)
    });
  }
    
 //paginación
  public actualizarPaginacion(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.trajesPaginados = this.trajes.slice(start, start + this.itemsPerPage);
  }

  public nextPage(): void {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
      this.actualizarPaginacion();
    }
  }

  public prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.actualizarPaginacion();
    }
  }

  public totalPages(): number {
    return Math.ceil(this.trajes.length / this.itemsPerPage);
  }
}