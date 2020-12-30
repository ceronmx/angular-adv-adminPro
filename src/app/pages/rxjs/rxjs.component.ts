import { Component, OnDestroy } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';
import { retry, take, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [],
})
export class RxjsComponent implements OnDestroy{

  private sub: Subscription;

  constructor() {

    this.sub = this.regresaIntervalo()
    .subscribe( console.log );

    // this.regresaObservable().pipe(retry()).subscribe(
    //   (data) => {
    //     console.log(data);
    //   },
    //   (error) => {
    //     console.error('Error: ', error);
    //   },
    //   () => {
    //     console.info('Finalizado');
    //   }
    // );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  regresaIntervalo(): Observable<number> {
    return interval(500).pipe(
      take(50),
      map( valor => valor + 1 ),
      filter( valor => (valor % 2 === 0) ? true : false ),
    )
  }

  regresaObservable(): Observable<number> {
    let i = -1;
    return new Observable<number>((subscriber) => {
      const intervalo = setInterval(() => {
        i++;
        subscriber.next(i);

        if (i === 2) {
          subscriber.error('i vale 2');
        }

        if (i === 5) {
          subscriber.complete();
        }
      }, 1000);
    });
  }
  
}
