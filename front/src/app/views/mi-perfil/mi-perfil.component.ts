import { Component } from '@angular/core';
import {RequestService} from '../../services/request.service';
import {Router} from '@angular/router';
import {Traje, Padre} from '../../models/response.interface';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css'
})
export class MiPerfilComponent {
  public parent: Padre | null = null;
  public reservedTrajes: Traje[] = [];

  public urlPadres = 'http://localhost:8001/api/padres/';
  public urlTrajes = 'http://localhost:8001/api/trajes';
  public userId = Number(localStorage.getItem('userId'));

  constructor(public service: RequestService, protected router: Router) {
  }

   public ngOnInit(): void {
    if (!this.userId) {
      this.router.navigate(['login']);
      return;
    }
    this.loadParent();
    this.loadReservedTrajes();
  }

  public loadParent(): void {
    this.service.getPadres(this.urlPadres + this.userId).subscribe({
      next: padre => {
        this.parent = padre as any;
      },
      error: err => console.error('No se pudo cargar el padre:', err)
    });
  }

  public loadReservedTrajes(): void {
    this.service.getTrajes(this.urlTrajes).subscribe({
      next: all => {
        this.reservedTrajes = all.filter(t =>
          t.reservadoPor === this.userId
        );
        console.log('Trajes reservados por mí:', this.reservedTrajes);
      },
      error: err => console.error('Error cargando trajes:', err)
    });
  }

  public cancelTraje(id: number): void {
    this.service.deleteTraje(`${this.urlTrajes}/${id}`).subscribe({
      next: () => this.loadReservedTrajes(),
      error: err => console.error('Error eliminando traje:', err)
    });
  }

  get user(): Padre | null {
    return this.parent;
  }

  public logout() {
    localStorage.clear()
    this.router.navigate(['/inicio']).then(() => {
      window.location.reload();
    });  
  }
}
