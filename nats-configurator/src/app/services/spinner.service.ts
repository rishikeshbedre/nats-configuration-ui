import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  public isWait = false;

  constructor() { }

  public loadSpinner() {
    this.isWait = true;
  }

  public stopSpinner() {
    this.isWait = false;
  }
}
