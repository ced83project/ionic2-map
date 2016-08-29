import {Component, ViewChild} from '@angular/core';
import {ionicBootstrap, Platform, MenuController, Nav} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {HelloIonicPage} from './pages/hello-ionic/hello-ionic';
import {ListPage} from './pages/list/list';
import {MapPage} from './pages/map/map';
import {LocationService} from './services/location-service';
import {FIREBASE_PROVIDERS, 
        defaultFirebase, 
        AngularFire, 
        firebaseAuthConfig, 
        AuthProviders,
        AuthMethods} from 'angularfire2'; 

@Component({
  templateUrl: 'build/app.html',
  providers: [
    LocationService,
    FIREBASE_PROVIDERS,
    defaultFirebase({
      apiKey: "AIzaSyAi-K8q65y2MxD_nTmAvcDRy9tL8RNF3Gs",
      authDomain: "api-project-678138092249.firebaseapp.com",
      databaseURL: "https://api-project-678138092249.firebaseio.com",
      storageBucket: "api-project-678138092249.appspot.com",
    }),
    firebaseAuthConfig({
      provider: AuthProviders.Password,
      method: AuthMethods.Password,
      remember: 'default',
      scope: ['email']
    })
  ]
})
class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage: any = HelloIonicPage;
  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public menu: MenuController
  ) {
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Hello Ionic', component: HelloIonicPage },
      { title: 'My First Map', component: MapPage },
      { title: 'My First List', component: ListPage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
}

ionicBootstrap(MyApp);
