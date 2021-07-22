import { Injectable, PipeTransform } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../environments/baseurl';

import { Producto } from '../model/producto';
import { PRODUCTOS } from '../Datos/productos';
import { DecimalPipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';

import { ProcessHTTPMsgService } from './process-httpmsg.service';




@Injectable({ providedIn: 'root' })
export class ProductService {
  myApiUrl!: string;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8'
    })
  };

  

  constructor(private pipe: DecimalPipe, private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService) {

    this.myApiUrl = '/productos/';
  }

  getProducts(): Observable<Producto[]> {
    return this.http.get<Producto[]>(baseURL + this.myApiUrl)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  

  getProductById(id: number): Observable<Producto> {
    return this.http.get<Producto>(baseURL + this.myApiUrl + id)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  updateProduct(postId: number, product: Producto): Observable<Producto> {
    return this.http.put<Producto>(baseURL + this.myApiUrl + postId, JSON.stringify(product), this.httpOptions)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  addProduct(product: Producto): Observable<Producto> {
    return this.http.post<Producto>(baseURL + this.myApiUrl, product, this.httpOptions)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  deleteProduct(postId: number): Observable<Producto> {
    return this.http.delete<Producto>(baseURL + this.myApiUrl + postId)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }


  
}