import { Component } from '@angular/core';
import { RequestService } from '../../services/request.service';
import { Traje } from '../../models/response.interface';
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
  public currentPage = 1;
  public itemsPerPage = 6;
  private apiUrlBase = 'http://localhost:8001/api';
  private apiUrlTrajes = `${this.apiUrlBase}/trajes`;

  constructor(private service: RequestService) {}

  ngOnInit(): void {
    this.getTrajesDisponibles();
  }

  private getTrajesDisponibles(): void {
    this.service.getTrajes(this.apiUrlTrajes).subscribe({
      next: (all: Traje[]) => {
        this.trajes = all.filter(t => t.disponible);
        this.actualizarPaginacion();
      },
      error: err => {
        console.error('Error al cargar trajes:', err);
        alert('No se pudieron cargar los trajes disponibles.');
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
    console.log('Reservar traje con id', id);
    alert(`Has reservado el traje ${id}!`);
  }
}
