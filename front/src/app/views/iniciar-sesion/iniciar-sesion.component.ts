import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {LoginResponse, Padre} from '../../models/response.interface';
import {RequestService} from '../../services/request.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-iniciar-sesion',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './iniciar-sesion.component.html',
  styleUrl: './iniciar-sesion.component.css'
})
export class IniciarSesionComponent {

  public apiSesion: string = 'http://localhost:8000/auth/login';
  public apiUrlPadre: string = 'http://localhost:8000/api/padres';
  public dataUser: Padre[] = [];
  reactiveForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    contraseña: new FormControl('', [Validators.required])
  });

  constructor(private service: RequestService, private router: Router) {
  }

  public getPadres(): void {
    this.service.getPadres(this.apiUrlPadre).subscribe((response) => {
      this.dataUser = response;
      console.log("Padres: ", response);
    }, (error) => {
      console.error("Error al obtener Padres:", error);
    });
  }

  public ngOnInit(): void {
    this.getPadres();
  }

  public onSubmit(): void {
    this.startSesion();
  }

  private startSesion(): void {
    const takeData = {
      email: this.reactiveForm.value.email ?? '',
      contrasena: this.reactiveForm.value.contraseña ?? ''
    };

    this.service.login(this.apiSesion, takeData).subscribe(
      (response: LoginResponse) => {
        console.log("Inicio de sesión exitoso:", response);
        this.router.navigate(["/inicio"]);
      },
      (error) => {
        console.error("Error al iniciar sesión:", error);
        alert("Correo o contraseña incorrectos. Inténtalo de nuevo.");
      }
    );
  }
}
