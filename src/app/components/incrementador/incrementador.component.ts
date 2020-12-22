import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: [
  ]
})
export class IncrementadorComponent implements OnInit {

  @Input() progresoIn: number;
  @Input() btnClass = 'btn-primary';

  @Output() progresoOut: EventEmitter<number> = new EventEmitter();

  ngOnInit(): void {
    this.btnClass = `btn ${this.btnClass}`;
  }

  get getProgreso(): string {
    return this.progresoIn + '%';
  }

  cambiarValor(n: number): number {
    if (this.progresoIn <= 0 && n < 0){
      this.progresoOut.emit(0);
      return this.progresoIn = 0;
    }
    if (this.progresoIn >= 100 && n > 0){
      this.progresoOut.emit(100);
      return this.progresoIn = 100;
    }

    this.progresoIn += n;
    this.progresoOut.emit(this.progresoIn);
  }


  cambio(valor: number): void{
    if (valor >= 100){
      valor = 100;
    } else if (valor <= 0) {
      valor = 0;
    } else {
      valor = valor;
    }

    this.progresoOut.emit(valor);

  }
}
