import { Routes } from '@angular/router';
import { InicioComponent } from './views/inicio/inicio.component';
import { ReservasComponent } from './views/reservas/reservas.component';
import { ContactameComponent } from './views/contactame/contactame.component';
import { MiPerfilComponent } from './views/mi-perfil/mi-perfil.component';

export const routes: Routes = [
    {path: 'inicio', component: InicioComponent},
    {path: 'contactame', component: ContactameComponent},
    {path: 'reservas', component: ReservasComponent},
    {path: 'perfil', component: MiPerfilComponent},


    {path: '', redirectTo: 'inicio', pathMatch: 'full'},

];  
