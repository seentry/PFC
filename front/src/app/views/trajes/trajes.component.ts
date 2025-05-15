import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../services/request.service';
import { Traje, Padre } from '../../models/response.interface';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardTrajeComponent } from '../../components/card-traje/card-traje.component';
import { HttpClientModule } from '@angular/common/http';
import { map } from 'rxjs/operators';

declare const bootstrap: any;

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

  public apiBase = 'http://localhost:8001/api';
  public urlTrajes = `${this.apiBase}/trajes`;
  public urlPadres = `${this.apiBase}/padres`;

  public loginUser = localStorage.getItem('userId');

  constructor(
    public service: RequestService,
    public fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadTrajes();
    this.getPadres();
  }

  public initForm(): void {
    this.trajeForm = this.fb.group({
      tipo: ['', Validators.required],
      talla: [null, [Validators.required, Validators.min(1)]],
      estado: ['', Validators.required],
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

  public getPadres(): void {
    this.service.getPadres(this.urlPadres).subscribe({
      next: padres => {
        console.log('Padres recibidos:', padres);
        this.padres = padres;
      },
      error: e => console.error('Error al cargar padres', e)
    });
  }

  public abrirFormulario(): void {
    const modalEl = document.getElementById('trajeModal');
    const modal = new bootstrap.Modal(modalEl);
    modal.show();  }

  public cerrarFormulario(): void {
    this.trajeForm.reset();
    const modalEl = document.getElementById('trajeModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal?.hide();  }

  //añadir traje
  public agregarTraje(): void {
  if (this.trajeForm.invalid) return;

  const formValues = this.trajeForm.value;
  const hoy = new Date().toISOString().slice(0, 10);

  const nuevoTraje: Traje = {
    ...formValues,
    disponible: true,
    duenoOriginal: this.loginUser,
    fechaIncorporacion: hoy
  };

  this.service.postTraje(this.urlTrajes, nuevoTraje)
    .subscribe({
      next: () => {
        this.sumarCreditoPadre();
        this.loadTrajes();
        this.cerrarFormulario();
      },
      error: e => console.error('Error al agregar traje', e)
    });
    
}

//suma credito
public sumarCreditoPadre(): void {
  const url = `${this.urlPadres}/${this.loginUser}`;
  this.service.getPadre(url).subscribe({
    next: (padre: Padre) => {
      const nuevoCredito = padre.credito + 1;
      this.service.updatePadre2(url, { credito: nuevoCredito }).subscribe({
        next: () => console.log('Crédito actualizado'),
        error: err => console.error('Error actualizando crédito', err)
      });
    },
    error: err => console.error('Error obteniendo padre', err)
  });
}

//eliminar traje
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

 //paginación
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
}
