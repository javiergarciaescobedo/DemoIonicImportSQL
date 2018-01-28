import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { BaseDatosLocalProvider } from './../../providers/base-datos-local/base-datos-local';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  datos: any = [];
  

  constructor(public navCtrl: NavController,  
        private baseDatosLocalProvider: BaseDatosLocalProvider,
        private alertCtrl: AlertController) {
    this.baseDatosLocalProvider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.datos = this.baseDatosLocalProvider.datos;
      }
    })

  }

}
