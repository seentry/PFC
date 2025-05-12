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
  private urlPadres = 'http://localhost:8001/api/padres/';
  private urlTrajes = 'http://localhost:8001/api/trajes/';
  public parent: Padre | null = null;
  public suit: Traje[] = [];
  private mainId = localStorage.getItem('userId');

  constructor(private service: RequestService, protected router: Router) {
  }

  public ngOnInit(): void {
    if (!this.mainId) {
      this.router.navigate(['login']);
      return;
    }

    this.service.getPadres(this.urlPadres + this.mainId).subscribe({
      next: (arr: Padre[]) => {
        this.parent = arr.length ? arr[0] : null;
      },
      error: (err: any) => console.error('No se pudo cargar el padre:', err)
    });

    this.loadTrajes();
  }

  get user(): Padre | null {
    return this.parent;
  }

  private loadTrajes(): void {
    const url = `${this.urlTrajes}user/${this.mainId}`;
    this.service.getTrajes(url).subscribe({
      next: (list: Traje[]) => {
        list.forEach(t => {
          const d = new Date(t.fechaIncorporacion);
          t.fechaIncorporacion = d.toLocaleString('es-ES', { timeZone: 'UTC' });
        });
        this.suit = list;
      },
      error: (err: any) => console.error('Error cargando trajes:', err)
    });
  }

  public cancelTraje(id: number): void {
    this.service.deleteTraje(this.urlTrajes + id).subscribe({
      next: () => this.loadTrajes(),
      error: (err: any) => console.error('Error eliminando traje:', err)
    });
  }

  public logout() {
    localStorage.clear()
    this.router.navigate(['/inicio']).then(() => {
      window.location.reload();
    });  }
}
