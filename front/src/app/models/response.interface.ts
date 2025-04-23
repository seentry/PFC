export interface Usuario {
  id?: number;
  nombre: string;
  apellidos: string;
  edad: number;
  tutorLegal: Padre;
  anoInscripcion: string;
}

export interface Padre {
  id?: number;
  nombre: string;
  apellidos: string;
  email: string;
  anoInscripcion: string;
  estadoPagos: "debe" | "pagado";
  credito: number;
  contrasena?: string;
}

export interface Traje {
  id: number;
  tipo: "gala" | "normal";
  talla: number;
  estado: "nuevo" | "aceptable" | "regular" | "mal";
  duenoOriginal: Padre;
  fechaIncorporacion: string;
  disponible: boolean;
}

export interface LoginResponse {
  id: number;
  email: string;
}

export interface LoginRequest {
  email: string;
  contrasena: string;
}