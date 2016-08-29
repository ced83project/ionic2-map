import {Component, NgZone, ViewChild, ElementRef} from '@angular/core';
import {ModalController, AlertController} from 'ionic-angular';
import {Geolocation} from 'ionic-native';
import {LocationService} from '../../services/location-service';
import {LocationDetailsPage} from '../location-details/location-details';
import {AngularFire} from 'angularfire2';

declare var google;

@Component({
  templateUrl: 'build/pages/map/map.html'
})
export class MapPage {
    
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  locations: any;
 
  constructor(
    private zone: NgZone,
    public af: AngularFire,
    public modalController: ModalController, 
    public alertController: AlertController, 
    public locationService: LocationService) {
  }
  
  ionViewLoaded(){

    this.locationService.findAll().subscribe(
      data => this.locations = data
    );

    // Retrieve the Locations
    //this.locations = this.af.database.list('/locations');
    this.loadMap();
  }
 
  loadMap(){
    
    Geolocation.getCurrentPosition().then((position) => {
 
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
      let mapOptions = {
        center: latLng,
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
          position: google.maps.ControlPosition.TOP_RIGHT,
          mapTypeIds: [
            google.maps.MapTypeId.ROADMAP,
            google.maps.MapTypeId.TERRAIN,
            google.maps.MapTypeId.SATELLITE,
            google.maps.MapTypeId.HYBRID 
          ]
        }
      }
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);      
      this.map.setTilt(45);
      
      // Create the search box and link it to the UI element.
      let input = document.getElementById('pac-input');
      let searchBox = new google.maps.places.SearchBox(input);
      this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

      this.loadMarkers();
      this.loadDirection();
      
    }, (err) => {
      console.log(err);
    });
 
  }
  
  loadDirection(){

        var directionsDisplay = new google.maps.DirectionsRenderer({
          map: this.map,
          draggable: true
        });

        // Set destination, origin and travel mode.
        var request = {
          destination: this.locations[2].name,
          origin: this.locations[3].name,
          travelMode: 'DRIVING',
          provideRouteAlternatives: true
        };

        // Pass the directions request to the directions service.
        var directionsService = new google.maps.DirectionsService();
        directionsService.route(request, function(response, status) {
          if (status === google.maps.DirectionsStatus.OK) {
            // Display the route on the map.
            directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
  }
  
  loadMarkers(){
  
    for (var i = 0; i < this.locations.length; i++) {
 
      let location = this.locations[i];
      console.log(JSON.stringify(location));
      
      let markerPos = new google.maps.LatLng(location.lat, location.lng);
 
      // Add the marker to the map
      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: markerPos
      });
 
      /** let content = "<h4>" + location.name + "</h4>"; */
      /** this.addInfoWindow(marker, content); */
      /** this.addAlert(marker, location);*/
      this.addModal(marker, location);
    }
  }
  
  addMarker(){
 
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });
   
    let content = "<h4>Me!</h4>";          
   
    this.addInfoWindow(marker, content);
   
  }
  
  addInfoWindow(marker, content){   
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
   
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }

  addAlert(marker, content){
    google.maps.event.addListener(marker, 'click', () => {
      this.showAlert(content);
    });  
  }
  showAlert(location) {
    let alert = this.alertController.create({
      title: location.name,
      subTitle: 'You have just selected the item',
      buttons: ['OK']
    });
    alert.present();
  }
  
  addModal(marker, content){
    google.maps.event.addListener(marker, 'click', () => {
      this.zone.run(() => {
        this.showModal(content);
      });
    });  
  }
  showModal(location) {
    let modal = this.modalController.create(LocationDetailsPage, {
      location: location
    });
    modal.present();
  }
}
