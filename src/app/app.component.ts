import { Component } from '@angular/core';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SoldierDataManager';
  data = {
    settings: {
      ptExpiredDays: 365,
      ptWarningDays: 60,
      htwtExpiredDays: 365,
      htwtWarningDays: 60,
      weaponsExpiredDays: 365,
      weaponsWarningDays: 60,
      phaExpiredDays: 365,
      phaWarningDays: 60,
      dentalExpiredDays: 365,
      dentalWarningDays: 60
    },
    soldiers: []
  };

  importFile = null;
  downloadElement = null;

  searchName = '';
  deleteName = '';

  generateName(soldier){
    return (soldier.rank ? soldier.rank + ' ' : '') + soldier.name;
  }

  private getNames(){
    const names = [];
    for ( const soldier of this.data.soldiers ){
      names.push(this.generateName(soldier));
    }
    return names;
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.getNames().filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  gotoSoldier(soldier){
    const el = document.getElementById(soldier);
    el.scrollIntoView({behavior: 'smooth'});
  }

  addSoldier() {
    this.data.soldiers.unshift(
      {
        name: '',
        rank: '',
        apftDate: '',
        apftStatus: '',
        htwtDate: '',
        htwtStatus: '',
        bodyFatStatus: '',
        phaDate: '',
        mrc: null,
        dentalDate: '',
        drc: null,
        weaponDate: '',
        weaponQualified: ''
      }
    );
  }

  removeSoldier(name){
    let idx = 0;
    for ( const soldier of this.data.soldiers ){
      if ( this.generateName(soldier) === name ){
        this.data.soldiers.splice(idx, 1);
        break;
      }
      idx++;
    }
  }

  onFileChanged(event) {
    this.importFile = event.target.files[0];
  }

  loadJson(){
    const fileReader = new FileReader();
    fileReader.readAsText(this.importFile, 'UTF-8');
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string') {
        this.data = JSON.parse(fileReader.result);
      }
    };
    fileReader.onerror = (error) => {
      console.log(error);
    };
    this.importFile = null;
  }

  getJson() {
    const theJSON = JSON.stringify(this.data);
    if ( this.downloadElement === null ){
      this.downloadElement = document.createElement('a');
    }
    this.downloadElement.setAttribute('href', `data:text/json;charset=utf-8,${encodeURIComponent(theJSON)}`);
    this.downloadElement.setAttribute('download', 'database.json');

    const event = new MouseEvent('click');
    this.downloadElement.dispatchEvent(event);
  }
}
