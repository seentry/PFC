import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Padre } from '../../models/response.interface';

@Component({
  selector: 'app-card-traje',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-traje.component.html',
  styleUrls: ['./card-traje.component.css']
})
export class CardTrajeComponent {
  @Input() id!: number;
  @Input() tipo: "gala" | "normal" = "normal";
  @Input() talla: number = 0;
  @Input() estado: "nuevo" | "aceptable" | "regular" | "mal" = "nuevo";
  @Input() duenoOriginal!: Padre;
  @Input() fechaIncorporacion: string = '';
  @Input() disponible: boolean = true;

  @Output() deleteTraje = new EventEmitter<void>();

}
