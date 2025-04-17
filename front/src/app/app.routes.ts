import { Routes } from '@angular/router';
import { InicioComponent } from './views/inicio/inicio.component';
import { ReservasComponent } from './views/reservas/reservas.component';
import { ContactameComponent } from './views/contactame/contactame.component';
import { MiPerfilComponent } from './views/mi-perfil/mi-perfil.component';
import { TrajesComponent } from './views/trajes/trajes.component';
import { IniciarSesionComponent } from './views/iniciar-sesion/iniciar-sesion.component';
import { RegistrarseComponent } from './views/registrarse/registrarse.component';

export const routes: Routes = [
    {path: 'inicio', component: InicioComponent},
    {path: 'contactame', component: ContactameComponent},
    {path: 'reservas', component: ReservasComponent},
    {path: 'perfil', component: MiPerfilComponent},
    {path: 'trajes', component: TrajesComponent},
    {path: 'inicio_sesion', component: IniciarSesionComponent},
    {path: 'registrarse', component: RegistrarseComponent},


    {path: '', redirectTo: 'inicio', pathMatch: 'full'},

];  
