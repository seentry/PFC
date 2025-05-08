// src/app/views/trajes/trajes.component.ts
import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../services/request.service';
import { Traje, Padre } from '../../models/response.interface';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardTrajeComponent } from '../../components/card-traje/card-traje.component';
import { HttpClientModule } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-trajes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardTrajeComponent,
    HttpClientModule
  ],
  templateUrl: './trajes.component.html',
  styleUrls: ['./trajes.component.css']
})
export class TrajesComponent implements OnInit {
  public trajes: Traje[] = [];
  public trajesPaginados: Traje[] = [];
  public padres: Padre[] = [];
  public currentPage = 1;
  public itemsPerPage = 6;
  public mostrarFormulario = false;
  public trajeForm!: FormGroup;

  private apiBase = 'http://localhost:8001/api';
  private urlTrajes = `${this.apiBase}/trajes`;
  private urlPadres = `${this.apiBase}/padres`;

  public loginUser = localStorage.getItem('userId');

  constructor(
    private service: RequestService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadTrajes();
    this.loadPadres();
  }

  private initForm(): void {
    this.trajeForm = this.fb.group({
      tipo: ['', Validators.required],
      talla: [null, [Validators.required, Validators.min(1)]],
      estado: ['', Validators.required],
      duenoOriginal: [null, Validators.required],
      fechaIncorporacion: ['', Validators.required]
    });
  }

  public loadTrajes(): void {
    this.service.getTrajes(this.urlTrajes)
      .subscribe({
        next: trajes => {
          console.log('Trajes recibidos desde la API:', trajes);
          this.trajes = trajes;
          this.updatePagination();
        },
        error: e => console.error('Error al cargar trajes', e)
      });
  }

  public loadPadres(): void {
    this.service.getPadres(this.urlPadres)
      .pipe(
        map((res: any) => res['hydra:member'] as Padre[])
      )
      .subscribe({
        next: padres => this.padres = padres,
        error: e => console.error('Error al cargar padres', e)
      });
  }

  public updatePagination(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.trajesPaginados = this.trajes.slice(start, start + this.itemsPerPage);
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
    return Math.ceil(this.trajes.length / this.itemsPerPage);
  }

  public abrirFormulario(): void {
    this.mostrarFormulario = true;
  }

  public cerrarFormulario(): void {
    this.trajeForm.reset();
    this.mostrarFormulario = false;
  }

  public agregarTraje(): void {
    if (this.trajeForm.invalid) return;

    const nuevo: Traje = {
      ...this.trajeForm.value,
      disponible: true
    };

    this.service.postTraje(this.urlTrajes, nuevo)
      .subscribe({
        next: () => {
          this.loadTrajes();
          this.cerrarFormulario();
        },
        error: e => console.error('Error al agregar traje', e)
      });
  }

  public eliminarTraje(id: number): void {
    this.service.deleteTraje(`${this.urlTrajes}/${id}`)
      .subscribe({
        next: () => {
          this.trajes = this.trajes.filter(t => t.id !== id);
          this.updatePagination();
        },
        error: e => console.error('Error al eliminar traje', e)
      });
  }
}
