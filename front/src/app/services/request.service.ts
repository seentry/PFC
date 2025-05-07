import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usuario, Traje, Padre, LoginRequest, LoginResponse } from '../models/response.interface';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private headers = new HttpHeaders({
    'Content-Type':  'application/json',
    'Accept':        'application/json'
  });
  


  constructor(private http: HttpClient) {}

  // Usuarios
  public getUsuarios(url: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(url);
  }

  public getUsuario(url: string): Observable<Usuario> {
    return this.http.get<Usuario>(url);
  }

  public createUsuario(url: string, usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(url, usuario);
  }

  // Trajes
  public getTrajes(url: string): Observable<Traje[]> {
    return this.http.get<Traje[]>(url);
  }

  public postTraje(url: string, traje: Traje): Observable<Traje> {
    return this.http.post<Traje>(url, traje);
  }

  public updateTraje(url: string, traje: Traje): Observable<Traje> {
    return this.http.patch<Traje>(url, traje);
  }

  public deleteTraje(url: string): Observable<void> {
    return this.http.delete<void>(url);
  }

  // Padres
  public getPadres(url: string): Observable<Padre[]> {
    return this.http.get<Padre[]>(url);
  }

  public createPadre(url: string, padre: Padre): Observable<Padre> {
    return this.http.post<Padre>(url, padre);
  }

  public updatePadre(url: string, padre: Padre): Observable<Padre> {
    return this.http.patch<Padre>(url, padre);
  }

  public deletePadre(url: string): Observable<void> {
    return this.http.delete<void>(url);
  }
  // Login
  public login(url: string, credentials: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(url, credentials);
  }
}
