import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../services/request.service';
import { Traje } from '../../models/response.interface';
import { CommonModule } from '@angular/common';
import { CardTrajeComponent } from '../../components/card-traje/card-traje.component';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, CardTrajeComponent],
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit {
  public trajesDisponibles: Traje[] = [];
  public trajesPaginados: Traje[] = [];
  public currentPage: number = 1;
  public itemsPerPage: number = 6;
  private apiUrlTrajes = 'http://localhost:8000/api/trajes';

  constructor(private service: RequestService) {}

  ngOnInit(): void {
    this.loadDisponibles();
  }

  private loadDisponibles(): void {
    this.service.getTrajes(this.apiUrlTrajes).subscribe({
      next: (all: Traje[]) => {
        this.trajesDisponibles = all.filter(t => t.disponible);
        this.updatePagination();
      },
      error: err => {
        console.error('Error al cargar trajes para reserva:', err);
        alert('No se pudieron cargar los trajes disponibles.');
      }
    });
  }

  private updatePagination(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.trajesPaginados = this.trajesDisponibles.slice(start, start + this.itemsPerPage);
  }

  public nextPage(): void {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  public prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  public totalPages(): number {
    return Math.ceil(this.trajesDisponibles.length / this.itemsPerPage);
  }

  public reservarTraje(id: number): void {
    console.log(`Reservando traje con ID ${id}`);
    // this.service.postReserva(`${this.apiUrlBase}/reservas`, { traje: id, usuario: userId })
    //   .subscribe(/* ... */);
  }
}
