import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usuario, Traje, Padre 
} from '../models/response.interface';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) {}

  // -------------------- USUARIOS --------------------
  public getUsuarios(url: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(url, { headers: this.headers });
  }

  public getUsuario(url: string): Observable<Usuario> {
    return this.http.get<Usuario>(url, { headers: this.headers });
  }

  public createUsuario(url: string, usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(url, usuario, { headers: this.headers });
  }

  // -------------------- TRAJES --------------------
  public getTrajes(url: string): Observable<Traje[]> {
    return this.http.get<any>(url, { headers: this.headers }).pipe(
      map(response => response['hydra:member'] as Traje[])
    );
  }

  public postTraje(url: string, traje: Traje): Observable<Traje> {
    return this.http.post<Traje>(url, traje, { headers: this.headers });
  }

  public updateTraje(url: string, traje: Traje): Observable<Traje> {
    return this.http.patch<Traje>(url, traje, { headers: this.headers });
  }

  public deleteTraje(url: string): Observable<void> {
    return this.http.delete<void>(url, { headers: this.headers });
  }

  // -------------------- PADRES --------------------
  public getPadres(url: string): Observable<Padre[]> {
    return this.http.get<Padre[]>(url, { headers: this.headers });
  }

  public createPadre(url: string, padre: Padre): Observable<Padre> {
    return this.http.post<Padre>(url, padre, { headers: this.headers });
  }

  public updatePadre(url: string, padre: Padre): Observable<Padre> {
    return this.http.patch<Padre>(url, padre, { headers: this.headers });
  }

  public deletePadre(url: string): Observable<void> {
    return this.http.delete<void>(url, { headers: this.headers });
  }
}
