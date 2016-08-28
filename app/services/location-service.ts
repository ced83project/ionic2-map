import {Injectable} from '@angular/core';
import {LOCATIONS} from './mocks/locations';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class LocationService {

/**
  constructor(public http: Http) {
    this.data = null;
  }
    
  retrieveData() {
    this.http.get('./mocks/locations.json')
    .subscribe(data => {
      this.data = data;
    });
  }

  getData() {
    return this.data;
  }
*/

  findAll() {
    return Observable.create(observer => {
      observer.next(LOCATIONS);
      observer.complete();
    });
  }
  findById(id) {
    return Observable.create(observer => {
      observer.next(LOCATIONS[id - 1]);
      observer.complete();
    });
  }
 
}