import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  lastUser = null;
  public dataSource = new BehaviorSubject([]);
  currentUser = this.dataSource.asObservable();

  constructor() { }

  checkInitialUserData(data) {
    if (data.length === 0) {
      data.push({ user: 'No users available' });
    }
    if (data.length < 10) {
      for (let i = data.length; i < 10; i++) {
        data.push({ user: null });
      }
    }
    return data;
  }

  formatDataPermissionComponent(data) {
    let tempData = [];
    if (data.length === 1) {
      if (data[0].user != null) {
        this.lastUser = data[0].user;
        if (data[0].permissions.publish != null) {
          for (let i = 0; i < data[0].permissions.publish.length; i++) {
            tempData.push({ user: data[0].user, publish: data[0].permissions.publish[i] });
          }
        }
        if (data[0].permissions.subscribe != null) {
          for (let j = 0; j < data[0].permissions.subscribe.length; j++) {
            for (let k = 0; k < tempData.length; k++) {
              if (!(tempData[k].hasOwnProperty('subscribe'))) {
                let tempsubscribe = tempData[k];
                tempsubscribe.subscribe = data[0].permissions.subscribe[j];
                tempData[k] = tempsubscribe;
                break;
              }
            }
            if (j > data[0].permissions.publish.length - 1) {
              let tempnewsubscribe = {
                user: data[0].user,
                subscribe: data[0].permissions.subscribe[j]
              };
              tempData.push(tempnewsubscribe);
            }
          }
        }
      }
    }
    if (tempData.length === 0 && data.length > 0 && data[0].user == null) {
      tempData.push({ publish: 'Invalid user selected', subscribe: 'Invalid user selected' });
    } else if (tempData.length === 0 && data.length === 1 && data[0].user != null) {
      tempData.push({ publish: 'No topic available', subscribe: 'No topic available', user: data[0].user });
    } else if (tempData.length === 0 && data.length > 1 && data[0].user != null && data[0].user != 'No users available') {
      tempData.push({ publish: 'More than one user selected', subscribe: 'More than one user selected' });
    } else if (data.length === 0) {
      tempData.push({ publish: 'No user is selected', subscribe: 'No user is selected' });
    }
    this.changeSelectedUser(tempData);
  }

  changeSelectedUser(message: any) {
    this.dataSource.next(message);
  }

  checkDeleteUserSelection(data) {
    if (data.length === 0) {
      return false;
    } else {
      for (let i = 0; i < data.length; i++) {
        if (data[i].user == null) {
          return false;
        }
      }
    }
    return true;
  }

  checkPublishorSubscribeUser(data, formattype) {
    for (let i = 0; i < data.length; i++) {
      if (data[i][formattype] === 'Invalid user selected') {
        return 'Invalid user selected';
      } else if (data[i][formattype] === 'More than one user selected') {
        return 'More than one user selected';
      } else if (data[i][formattype] === 'No user is selected') {
        return 'No user is selected';
      }
    }
    return true;
  }

  checkPublishorSubscribeSelected(data, formattype) {
    if (data.length === 0) {
      return 'Please select a topic for deletion';
    }
    for (let i = 0; i < data.length; i++) {
      if (data[i][formattype] === 'Invalid user selected'
          || data[i][formattype] === 'More than one user selected'
          || data[i][formattype] === 'No user is selected'
          || data[i][formattype] === 'No topic available'
          || data[i][formattype] == null) {
        return 'Select a valid topic for deletion';
      }
    }
    return true;
  }
}
