import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { BaseDatosLocalProvider } from './../../providers/base-datos-local/base-datos-local';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  datos: any = [];  

  constructor(public navCtrl: NavController, private baseDatosLocalProvider: BaseDatosLocalProvider) {
    // Suscripción para detectar cuándo la BD ha terminado de cargar datos 
    let suscripcionBDPreparada = baseDatosLocalProvider.getDatabaseState()
      .subscribe(baseDatosPreparada => {
        if (baseDatosPreparada) {
          // Mantener una referencia a los datos como una propiedad de esta clase
          this.datos = baseDatosLocalProvider.datos;
          // Terminar la suscripción
          suscripcionBDPreparada.unsubscribe();
        }
      });
  }

}
