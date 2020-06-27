import {Component, Input, OnInit} from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[soldier]',
  templateUrl: './soldier.component.html',
  styleUrls: ['./soldier.component.css']
})
export class SoldierComponent implements OnInit {
  @Input() soldierData;
  @Input() settings;

  constructor() { }

  ngOnInit(): void {
  }

  getDate(){
    return new Date().toISOString().substring(0, 10);
  }

  checkGeneric(value){
    if ( value === null || value === '' ){
      return 'form-control alert-info';
    }
    else {
      return 'form-control';
    }
  }

  checkDate(date, expire, warn){
    const dateTime = new Date(date).getTime();
    if ( isNaN(dateTime) ){
      return 'form-control alert-info';
    }
    const days = (new Date().getTime() - dateTime) / 86400000;
    if ( days > expire ){
      return 'form-control alert-danger';
    }
    else if ( days > expire - warn ){
      return 'form-control alert-warning';
    }
    else {
      return 'form-control';
    }
  }

  checkStatus(status){
    if ( status === '' || status === null ){
      return 'form-control alert-info';
    }
    else if ( status === 'fail' ){
      return 'form-control alert-danger';
    }
    else {
      return 'form-control';
    }
  }

  checkCode(code){
    if ( code === null ){
      return 'form-control alert-info';
    }
    else if ( code >= 3 ){
      return 'form-control alert-danger';
    }
    else {
      return 'form-control';
    }
  }
}
