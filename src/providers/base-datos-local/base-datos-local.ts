//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Platform, AlertController } from 'ionic-angular';

import 'rxjs/add/operator/map';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs/Rx';

@Injectable()
export class BaseDatosLocalProvider {
  // Array donde se almacenará la información contenida en la BD
  datos: any = [];
  // Variable que se usará con subscribe para detectar BD preparada 
  private databaseReady: BehaviorSubject<boolean>;

  constructor(public http: Http, private platform: Platform, 
        private sqlite: SQLite, private sqliteporter: SQLitePorter, 
        private alertCtrl: AlertController) {
    // Inicialmente se indica que la BD no está aún proeparada
    this.databaseReady = new BehaviorSubject(false);
    this.abrirBaseDatos();
  }

  abrirBaseDatos() {
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
                // Informar que la base de datos está lista
                this.databaseReady.next(true);
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
                        // Informar que la base de datos está lista
                        this.databaseReady.next(true);
                      }).catch(e => {
                        alert("Error al importar la base de datos");
                        console.error("Error al importar la base de datos", e.message);
                      });
                  })
              });
          });
      }).catch(e => alert('Platform is not ready.'));    
  }

  obtenerDatos(baseDatos) {
    let resultado = [];
    // Realizar la consulta a la BD para extraer los datos
    baseDatos.executeSql('SELECT * FROM tableItems', [])
      .then(resSelect => {
        // Recorrer todas las filas obtenidas
        for (var i = 0; i < resSelect.rows.length; i++) { 
          // Añadir al array de datos la información desglosada
          resultado.push({ 
            unTextoCorto: resSelect.rows.item(i).unTextoCorto, 
            unTextoLargo: resSelect.rows.item(i).unTextoLargo 
          });
        } 
      }).catch(e => {
        alert("Error: No se ha podido consultar los datos",);
        console.error("Error en Select de consulta de datos", e.message);
      });
    return resultado;
  }

  /*
  * Método para obtener el Observable que se utilizará con susbcribe
  * para detectar cuándo está lista la base de datos
  */
  getDatabaseState() {
    return this.databaseReady.asObservable();
  }



}
