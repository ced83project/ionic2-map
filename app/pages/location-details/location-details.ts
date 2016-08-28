import {Component} from '@angular/core';
import {Platform, NavParams, ViewController} from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/location-details/location-details.html'
})
export class LocationDetailsPage {

  location: any;
 
  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController
  ) {
    // If we navigated to this page, we will have a location available as a nav param
    this.location = this.params.get('location');
  }
 
  dismiss() {
    this.viewCtrl.dismiss();
  } 
}
