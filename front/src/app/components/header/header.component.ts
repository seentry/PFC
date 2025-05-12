import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../services/request.service';
import { Padre } from '../../models/response.interface';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public userStartSesion = false;
  public credits = 0;
  private urlPadres = 'http://localhost:8001/api/padres';

  constructor(private service: RequestService) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    this.userStartSesion = !!userId;

    if (this.userStartSesion && userId) {
      // Trae los datos del padre/logged-in user y asigna sus créditos
      this.service.getPadre(`${this.urlPadres}/${userId}`).subscribe({
        next: (padre: Padre) => this.credits = padre.credito,
        error: (err) => console.error('No se pudieron cargar los créditos', err)
      });
    }
  }
}
