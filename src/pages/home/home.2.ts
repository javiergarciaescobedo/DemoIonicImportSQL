import { Component } from '@angular/core';
import { NavController, Platform, AlertController } from 'ionic-angular';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  datos: any = [];

  constructor(public navCtrl: NavController, private platform: Platform, 
        private sqlite: SQLite, private sqliteporter: SQLitePorter, 
        private http: Http, private alertCtrl: AlertController) {

  }

  ionViewDidLoad() {
    // Make ready to platform
    this.platform.ready()
      .then(() => {
        // Crear o abrir la base de datos MiAppBD.db
        this.sqlite.create({
          name: 'MiAppBD.db',
          location: 'default'
        })
          .then((db: SQLiteObject) => {
            // Consulta para comprobar si ya existen los datos
            db.executeSql('SELECT * FROM tableItems', [])
              .then(res => {
                // Los datos ya estaban en la BD
                this.alertCtrl.create({
                  title: 'Información',
                  message: 'Los datos ya estaban en la BD',
                  buttons: ['Aceptar']
                }).present();
                // Procesar los datos de la base de datos
                this.datos = this.obtenerDatos(db);
              }) 
              .catch(res => {
                // Los datos no están en la BD. Hay que importarlos
                this.alertCtrl.create({
                  title: 'Información',
                  message: 'Se van a importar los datos a la BD',
                  buttons: ['Aceptar']
                }).present();
                // Obtener el archivo que contiene las sentencias SQL
                this.http.get('assets/CrearBaseDatos.sql')
                  .map(res => res.text())
                  .subscribe(sql => {
                    // Ejecutar las sentencias SQL del archivo
                    this.sqliteporter.importSqlToDb(db, sql)
                      .then(() => {
                        // Procesar los datos de la base de datos
                        this.datos = this.obtenerDatos(db);
                      }).catch(e => alert("Error al importar la base de datos"));
                  })
              });
          });
      }).catch(e => alert('Platform is not ready.'));
  }

  obtenerDatos(baseDatos) {
    let resultado = [];
    baseDatos.executeSql('SELECT * FROM tableItems', [])
      .then(resSelect => {
        for (var i = 0; i < resSelect.rows.length; i++) { 
          resultado.push({ 
            unTextoCorto: resSelect.rows.item(i).unTextoCorto, 
            unTextoLargo: resSelect.rows.item(i).unTextoLargo 
          });
        } 
      }).catch(e => {
        alert("Error: No se ha podido consultar los datos",);
        console.error("Error en Select", e.message);
      });
    return resultado;
  }

}
