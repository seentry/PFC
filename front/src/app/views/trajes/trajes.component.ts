import { Component } from '@angular/core';
import { RequestService } from '../../services/request.service';
import { Traje, Padre } from '../../models/response.interface';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardTrajeComponent } from '../../components/card-traje/card-traje.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-trajes',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CardTrajeComponent, HttpClientModule],
  templateUrl: './trajes.component.html',
  styleUrls: ['./trajes.component.css']
})
export class TrajesComponent {
  public trajes: Traje[] = [];
  public trajesPaginados: Traje[] = [];
  public currentPage: number = 1;
  public itemsPerPage: number = 6;
  public apiUrlBase: string = 'http://localhost:8000/api';
  public apiUrlTrajes: string = `${this.apiUrlBase}/trajes`;
  public apiUrlPadres: string = `${this.apiUrlBase}/padres`;
  public mostrarFormulario: boolean = false;
  public trajeForm!: FormGroup;

  public padres: Padre[] = [];

  constructor(private service: RequestService, private fb: FormBuilder) { }

  public loginUser = localStorage.getItem('userId')

  public ngOnInit(): void {
    console.log('Inicializando componente de trajes...');
    this.getTrajes();
    this.getPadres();
    this.initForm();
  }

  public getTrajes(): void {
    console.log('Obteniendo trajes desde:', this.apiUrlTrajes);
    this.service.getTrajes(this.apiUrlTrajes).subscribe(
      (response: Traje[]) => {
        console.log("Trajes recibidos:", response);
        this.trajes = response;
        this.actualizarPaginacion();
      },
      (error) => {
        console.error("Error al obtener trajes:", error);
        alert('Error al cargar los trajes. Por favor, verifica que el servidor esté corriendo.');
      }
    );
  }

  public getPadres(): void {
    const apiUrlPadres = `${this.apiUrlBase}/padres`;
    console.log('Obteniendo padres desde:', apiUrlPadres);
    this.service.getPadres(apiUrlPadres).subscribe(
      (response: Padre[]) => {
        console.log("Padres recibidos:", response);
        this.padres = response;
      },
      (error) => {
        console.error("Error al obtener padres:", error);
        alert('Error al cargar los padres. Por favor, verifica que el servidor esté corriendo.');
      }
    );
  }

  public actualizarPaginacion(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.trajesPaginados = this.trajes.slice(startIndex, endIndex);
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

  public eliminarTraje(id: number): void {
    if (id === undefined) return;
    const deleteUrl = `${this.apiUrlTrajes}/${id}`;
    this.service.deleteTraje(deleteUrl).subscribe({
      next: () => {
        this.trajes = this.trajes.filter(traje => traje.id !== id);
        this.actualizarPaginacion();
      },
      error: (err) => {
        console.error('Error eliminando el traje:', err);
        alert('Hubo un error al eliminar el traje.');
      }
    });
  }

  public abrirFormulario(): void {
    this.mostrarFormulario = true;
  }

  public cerrarFormulario(): void {
    this.trajeForm.reset();
    this.mostrarFormulario = false;
  }

  public agregarTraje(): void {
    if (this.trajeForm.invalid) {
      return;
    }
    
 const formValue = this.trajeForm.value;

 const nuevoTraje: Traje = {
   ...formValue,
   disponible: true
 };
 
    this.service.postTraje(this.apiUrlTrajes, nuevoTraje).subscribe({
      next: () => {
        this.getTrajes();
        this.actualizarPaginacion();
        this.cerrarFormulario();
      },
      error: (err) => {
        console.error('Error al agregar el traje:', err);
        alert('Hubo un error al agregar el traje.');
      }
    });
  }

  private initForm(): void {
    this.trajeForm = this.fb.group({
      tipo: ['', Validators.required],
      talla: [0, [Validators.required, Validators.min(1)]],
      estado: ['', Validators.required],
      duenoOriginal: [null, Validators.required],
      fechaIncorporacion: ['', Validators.required]
    });
  }
}
