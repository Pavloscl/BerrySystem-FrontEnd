import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import {Observable, of, Subject} from 'rxjs';
import { baseURL } from '../environments/baseurl';
import { catchError } from 'rxjs/operators';
import { Trabajador } from '../model/trabajador';

@Injectable({
  providedIn: 'root'
})
export class WorkService {
  myApiUrl: string;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8'
    })
  };
  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService) {
      this.myApiUrl = '/trabajadores/';
     }

addEmployee(employee: Trabajador): Observable<Trabajador> {
  return this.http.post<Trabajador>(baseURL + this.myApiUrl ,  employee, this.httpOptions)
    .pipe(catchError(this.processHTTPMsgService.handleError));
}

}