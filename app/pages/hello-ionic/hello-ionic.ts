import {Component, OnInit, Inject, AfterViewInit} from '@angular/core';
import {ModalController, NavController, Page} from 'ionic-angular';
import {Observable} from 'rxjs/Observable';
import {Camera} from 'ionic-native';
import {LoginPage} from '../login/login';
import {AngularFire, AuthProviders, AuthMethods, FirebaseAuthState} from 'angularfire2';
import 'rxjs';


@Component({
  templateUrl: 'build/pages/hello-ionic/hello-ionic.html'
})
export class HelloIonicPage {

  public base64Image: string;
  locations: Observable<any[]>;
  
  authInfo: any;
  displayName: any;
  buttonTitle = "Login";
    
  constructor( 
    public af: AngularFire,
    public navCtrl: NavController,
    public modalCtrl: ModalController) {
  }
  
    ionViewDidEnter() {
      this.af.auth.getAuth() && (this.locations = this.af.database.list('/locations'))
    }
  
    ngOnInit() {

        // subscribe to the auth object to check for the login status
        // of the user, if logged in, save some user information and
        // execute the firebase query...
        // .. otherwise
        // show the login modalCtrl page

        this.af.auth.subscribe((data: FirebaseAuthState) => {
            console.log("in auth subscribe", data)

            if (data && !data.anonymous) {

                this.af.auth.unsubscribe()
                this.buttonTitle = "Logout"

                // if no user, then add it
                this.addOrUpdateUser(data)

                if (data.auth.providerData[0].providerId === "twitter.com") {
                    this.authInfo = data.auth.providerData[0]
                    this.displayName = data.auth.providerData[0].displayName
                } else if (data.github) {
                    this.authInfo = data.github
                    //this.authInfo.displayName = data.github.displayName
                } else {
                    this.authInfo = data.auth || {}
                    this.displayName = data.auth.providerData[0].email
                }
                
                // Retrieve Data
                this.locations = this.af.database.list('/locations');
                
            } else {
                this.buttonTitle = "LOGIN"
                this.authInfo = null
                this.displayLoginModal()
            }
        })
    }

    addOrUpdateUser(_authData) {
        const itemObservable = this.af.database.object('/users/' + _authData.uid);
        itemObservable.set({
            "provider": _authData.auth.providerData[0].providerId,
            "avatar": _authData.auth.photoURL || "MISSING",
            "displayName": _authData.auth.providerData[0].displayName || _authData.auth.email,
        })
    }
    
    /**
     * displays the login window
     */
    displayLoginModal() {
      let loginPage = this.modalCtrl.create(LoginPage, { af: this.af });
      loginPage.present();
    }

    /**
     * logs out the current user
     */
    logoutClicked() {
        if (this.authInfo && (this.authInfo.email || this.authInfo.providerId)) {
            this.af.auth.logout();
            this.authInfo = null
            this.displayLoginModal()
        } else {
            this.displayLoginModal()
        }
    }

    /**
     * get locations
     */
    getLocations() {
      this.locations = this.af.database.list('/locations');
      console.log(this.locations);
    }  

    /**
     * take picture
     */    
    takePicture(){
      Camera.getPicture({
          destinationType: Camera.DestinationType.DATA_URL,
          targetWidth: 1000,
          targetHeight: 1000
      }).then((imageData) => {
        // imageData is a base64 encoded string
          this.base64Image = "data:image/jpeg;base64," + imageData;
      }, (err) => {
          console.log(err);
      });
    }
}
