import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

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
        private http: Http) {

  }

  ionViewDidLoad() {
    // Make ready to platform
    this.platform.ready()
      .then(() => {
        // Create or open database Sqlite.db
        this.sqlite.create({
          name: 'Sqlite.db',
          location: 'default'
        })
          // Check employees table is available
          .then((db: SQLiteObject) => {
            db.executeSql('SELECT * FROM tableItems', [])
              // If employees table has been import
              .then(() => {
                db.executeSql('SELECT * FROM tableItems', [])
                  .then(res => {
                    for (var i = 0; i < res.rows.length; i++) { 
                      this.datos.push({ 
                        unTextoCorto: res.rows.item(i).unTextoCorto, 
                        unTextoLargo: res.rows.item(i).unTextoLargo 
                      }) 
                    } 
                  }) 
              }) // If App launch first time we have to go import employees.sql file into SQLite i.e internal storage 
              .catch(res => {
                this.http.get('assets/CrearBaseDatos.sql')
                  .map(res => res.text())
                  .subscribe(sql => {
                    this.sqliteporter.importSqlToDb(db, sql)
                      .then(() => {
                        db.executeSql('SELECT * FROM tableItems', [])
                          .then(res => {
                            //alert(res.rows.length);
                            for (var i = 0; i < res.rows.length; i++) { 
                              this.datos.push({ 
                                unTextoCorto: res.rows.item(i).unTextoCorto, 
                                unTextoLargo: res.rows.item(i).unTextoLargo 
                              }) 
                            } 
                          }).catch(e => alert("Not Fetching"))
                      }).catch(e => alert("Error while importing DB"))
                  })
              });
          });
      }).catch(e => alert('Platform is not ready.'))
  }

}
