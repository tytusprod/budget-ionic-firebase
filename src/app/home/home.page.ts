import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  dochod: number = undefined;
  kategorie: any[] = [];

  constructor(
    private nativeStorage: NativeStorage,
    private firebase: AngularFireDatabase,
    private firebaseAuth: AngularFireAuth,
    public alertController: AlertController
    ) {
  }

  async ngOnInit() {
    this.nativeStorage.getItem('dochod').then(
      data => {
        console.log('Pobrano z nativestorage dochod');
        this.dochod = data.dochod;
      },
      error => console.error(error)
    );
    this.nativeStorage.getItem('kategorie').then(
      data => {
        console.log('Pobrano z nativestorage kategorie');
        this.kategorie = data;
      },
      error => console.error(error)
    );

    this.firebaseAuth.signInWithEmailAndPassword('', '')
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        console.log(user);
        this.firebase.list('dochod/').valueChanges().subscribe(dochod => {
          this.dochod = Number(dochod[0]);
        });
        this.firebase.list('kategorie/').valueChanges().subscribe(kategorie => {
          this.kategorie = kategorie;
        });
        this.sumUpOnFirstDayOfMonth();
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
      });


  }

  async addDochod() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Dodaj miesięczny dochód',
      inputs: [
        {
          name: 'dochod',
          type: 'number',
          placeholder: 'Miesięczny dochód',
          min: 0
        }
      ],
      buttons: [
        {
          text: 'Anuluj',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Zapisz',
          handler: (alertData) => {
            this.dochod = alertData.dochod;
            this.nativeStorage.setItem('dochod', {dochod: alertData.dochod}).then(
              () => {
                console.log('Zapisano dochod');
                this.firebase.object('dochod/').set({
                  dochod: alertData.dochod
                }).then(() => {
                  console.log('Zapisano dochod firebase');
                });
              },
              error => console.error('Error storing item', error)
            );
          }
        }
      ]
    });

    await alert.present();
  }

  async editDochod() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Edytuj miesięczny dochód',
      inputs: [
        {
          name: 'dochod',
          type: 'number',
          value: this.dochod,
          placeholder: 'Miesięczny dochód',
          min: 0
        }
      ],
      buttons: [
        {
          text: 'Anuluj',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Usuń dochód',
          cssClass: 'secondary',
          handler: (alertData) => {
            this.dochod = undefined;
            this.nativeStorage.setItem('dochod', {dochod: alertData.dochod}).then(
              () => {
                console.log('Zapisano kategorie');
                this.firebase.object('dochod/').set({
                  dochod: 0
                }).then(() => {
                  console.log('Zapisano kategorie firebase');
                });
              },
              error => console.error('Error storing item', error)
            );
          }
        }, {
          text: 'Zapisz',
          handler: (alertData) => {
            console.log('Confirm Ok');
            this.dochod = alertData.dochod;
            this.nativeStorage.setItem('dochod', {dochod: alertData.dochod}).then(
              () => {
                console.log('Zedytowano dochod');
                this.firebase.object('dochod/').set({
                  dochod: alertData.dochod
                }).then(() => {
                  console.log('Zapisano dochod firebase');
                });
              },
              error => console.error('Error storing item', error)
            );
            console.log(this.dochod);
          }
        }
      ]
    });

    await alert.present();
  }

  async addCategory() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Dodaj kategorię wydatków',
      inputs: [
        {
          name: 'nazwa',
          type: 'text',
          placeholder: 'Nazwa'
        },
        {
          name: 'initKwota',
          type: 'number',
          placeholder: 'Kwota'
        },
      ],
      buttons: [
        {
          text: 'Anuluj',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Dodaj',
          handler: (alertData) => {
            const object = {
              nazwa: alertData.nazwa,
              initKwota: Number(alertData.initKwota).toFixed(2),
              actualKwota: Number(alertData.initKwota).toFixed(2)
            };
            this.kategorie.push(object);
            this.nativeStorage.setItem('kategorie', this.kategorie).then(
              () => {
                console.log('Zapisano kategorie');
                this.firebase.object('kategorie/').set(
                  this.kategorie
                ).then(() => {
                  console.log('Zapisano kategorie firebase');
                });
              },
              error => console.error('Error storing item', error)
            );
          }
        }
      ]
    });

    await alert.present();
  }

  async editCategory(category: any, index: number) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Edytuj kategorię wydatków',
      inputs: [
        {
          name: 'nazwa',
          type: 'text',
          value: category.nazwa,
          placeholder: 'Nazwa'
        },
        {
          name: 'initKwota',
          type: 'number',
          value: category.initKwota,
          placeholder: 'Kwota'
        },
      ],
      buttons: [
        {
          text: 'Anuluj',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Usuń kategorię',
          cssClass: 'secondary',
          handler: (alertData) => {
            this.kategorie.splice(index, 1);
            this.nativeStorage.setItem('kategorie', this.kategorie).then(
              () => {
                console.log('Zapisano kategorie');
                this.firebase.object('kategorie/').set(
                  this.kategorie
                ).then(() => {
                  console.log('Zapisano kategorie firebase');
                });
              },
              error => console.error('Error storing item', error)
            );
          }
        }, {
          text: 'Zapisz',
          handler: (alertData) => {
            const object = {
              nazwa: alertData.nazwa,
              initKwota: Number(alertData.initKwota).toFixed(2),
              actualKwota: Number(category.actualKwota).toFixed(2)
            };
            this.kategorie[index] = object;
            this.nativeStorage.setItem('kategorie', this.kategorie).then(
              () => {
                console.log('Zapisano kategorie');
                this.firebase.object('kategorie/').set(
                  this.kategorie
                ).then(() => {
                  console.log('Zapisano kategorie firebase');
                });
              },
              error => console.error('Error storing item', error)
            );
          }
        }
      ]
    });

    await alert.present();
  }

  async addToCategory(category: any, index: number) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Dodaj kwotę do kategorii',
      inputs: [
        {
          name: 'kwota',
          type: 'number',
          placeholder: 'Kwota'
        },
      ],
      buttons: [
        {
          text: 'Anuluj',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Zapisz',
          handler: (alertData) => {
            const actual = Number(category.actualKwota) + Number(alertData.kwota);
            const object = {
              nazwa: category.nazwa,
              initKwota: Number(category.initKwota).toFixed(2),
              actualKwota: actual.toFixed(2)
            };
            this.kategorie[index] = object;
            this.nativeStorage.setItem('kategorie', this.kategorie).then(
              () => {
                console.log('Zapisano kategorie');
                this.firebase.object('kategorie/').set(
                  this.kategorie
                ).then(() => {
                  console.log('Zapisano kategorie firebase');
                });
              },
              error => console.error('Error storing item', error)
            );
          }
        }
      ]
    });

    await alert.present();
  }

  async substractionFromCategory(category: any, index: number) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Dodaj wydatek',
      inputs: [
        {
          name: 'kwota',
          type: 'number',
          placeholder: 'Kwota'
        },
      ],
      buttons: [
        {
          text: 'Anuluj',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Zapisz',
          handler: (alertData) => {
            const actual = Number(category.actualKwota) - Number(alertData.kwota);
            const object = {
              nazwa: category.nazwa,
              initKwota: Number(category.initKwota).toFixed(2),
              actualKwota: actual.toFixed(2)
            };
            this.kategorie[index] = object;
            this.nativeStorage.setItem('kategorie', this.kategorie).then(
              () => {
                console.log('Zapisano kategorie');
                this.firebase.object('kategorie/').set(
                  this.kategorie
                ).then(() => {
                  console.log('Zapisano kategorie firebase');
                });
              },
              error => console.error('Error storing item', error)
            );
          }
        }
      ]
    });

    await alert.present();
  }

  sumAllCategories(): number {
    let sum = 0;
    this.kategorie.forEach(element => {
      sum = Number(sum) + Number(element.initKwota);
    });
    return Number(sum);
  }

  async sumUpOnFirstDayOfMonth() {
    const currentDate = new Date().toLocaleDateString();
    const day = currentDate.slice(0, 2);
    if (day === '01') {
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Nowy miesiąc',
        message: 'Dzisiaj pierwszy dzień miesiąca, przenieść kwoty które pozostały na kolejny miesiąc?',
        buttons: [
          {
            text: 'Nie',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }, {
            text: 'Tak',
            handler: (alertData) => {
              this.kategorie.forEach(element => {
                element.actualKwota = Number(element.actualKwota) + Number(element.initKwota);
              });
              this.nativeStorage.setItem('kategorie', this.kategorie).then(
                () => {
                  console.log('Zapisano kategorie');
                  this.firebase.object('kategorie/').set(
                    this.kategorie
                  ).then(() => {
                    console.log('Zapisano kategorie firebase');
                  });
                },
                error => console.error('Error storing item', error)
              );
            }
          }
        ]
      });

      await alert.present();
    }
  }

}
