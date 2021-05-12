import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  serverURL = window.location.protocol == 'https:' ? 'https//' + window.location.hostname + '/nats-config-api' : 'http://' + window.location.hostname + ':6060';

  constructor(private httpclient: HttpClient) { }

  getUser() {
    return this.httpclient.get<any>(this.serverURL + '/user')
      .pipe(catchError(this.errorHandler));
  }

  addUser(data) {
    return this.httpclient.post<any>(this.serverURL + '/user', data)
      .pipe(catchError(this.errorHandler));
  }

  deleteUser(data) {
    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: data
    };
    return this.httpclient.delete<any>(this.serverURL + '/user', httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  getTopics() {
    return this.httpclient.get<any>(this.serverURL + '/topic')
      .pipe(catchError(this.errorHandler));
  }

  addTopic(data) {
    return this.httpclient.post<any>(this.serverURL + '/topic', data)
      .pipe(catchError(this.errorHandler));
  }

  deleteTopic(data) {
    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: data
    };
    return this.httpclient.delete<any>(this.serverURL + '/topic', httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  downloadConfiguration() {
    return this.httpclient.post<any>(this.serverURL + '/reload', {})
      .pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error);
  }

}
