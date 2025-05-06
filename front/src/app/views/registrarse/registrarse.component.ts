import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Padre} from '../../models/response.interface';
import {RequestService} from '../../services/request.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-registrarse',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './registrarse.component.html',
  styleUrl: './registrarse.component.css'
})
export class RegistrarseComponent {

  public apiUrlPadre: string = 'http://localhost:8001/api/padres';
  public dataUserClient: Padre[] = [];
  reactiveForm = new FormGroup({
    nombre: new FormControl(''),
    apellidos: new FormControl(''),
    email: new FormControl(''),
    contrasena: new FormControl(''),
  });

  constructor(private service: RequestService, private router: Router) {
  }

  public getPadres(): void {
    this.service.getPadres(this.apiUrlPadre).subscribe((response) => {
      this.dataUserClient = response;
      console.log("Padres: ", response);
    }, (error) => {
      console.error("Error al obtener Padres:", error);
    });
  }

  public ngOnInit(): void {
    this.getPadres();
  }

  public onSubmit(): void {
    if (this.reactiveForm.valid) {
      this.createPadre();
    } else {
      console.log("Por favor, completa todos los campos correctamente.");
    }
  }

  
  public createPadre(): void {
    const today = new Date().toISOString().substring(0, 10);
    const newParent: Padre = {
      nombre: this.reactiveForm.value.nombre ?? '',
      apellidos: this.reactiveForm.value.apellidos ?? '',
      email: this.reactiveForm.value.email ?? '',
      contrasena: this.reactiveForm.value.contrasena ?? undefined,
      anoInscripcion: today,
      estadoPagos: 'pagado',
      credito: 0
    };

    this.service.createPadre(this.apiUrlPadre, newParent).subscribe(
      (response) => console.log('usuario creada con éxito:', response),
      (error) => console.error('Error al crear usuario:', error)
    )

    this.router.navigate(["/inicio_sesion"]);
  }
}
