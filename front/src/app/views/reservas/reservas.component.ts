import { Component } from '@angular/core';
import { RequestService } from '../../services/request.service';
import { Traje, Padre } from '../../models/response.interface';
import { CommonModule } from '@angular/common';
import { CardTrajeComponent } from '../../components/card-traje/card-traje.component';
import { HttpClientModule } from '@angular/common/http';

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

  constructor(public service: RequestService) {}

  ngOnInit(): void {
    this.getTrajesDisponibles();
  }

  public getTrajesDisponibles(): void {
    this.service.getTrajes(this.apiUrlTrajes).subscribe({
      next: (all: Traje[]) => {
        this.trajes = all.filter(t => t.disponible);
        console.log('Trajes disponibles:', this.trajes);
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

   public reservarTraje(id: number): void {
    if (!this.userId) {
      alert('Debes iniciar sesión para reservar');
      return;
    }

    const url = `${this.apiUrlTrajes}/${id}`;
    const update: Partial<Traje> = {
      disponible: false,
      reservadoPor: this.userId
    };

    this.service.updateTraje(url, update).subscribe({
      next: updated => {
        console.log('Traje reservado:', updated);
        alert(`Has reservado el traje ${id} correctamente.`);
        this.getTrajesDisponibles();
      },
      error: err => {
        console.error('Error al reservar traje:', err);
        alert('No se pudo reservar el traje.');
      }
    });
  }
}
