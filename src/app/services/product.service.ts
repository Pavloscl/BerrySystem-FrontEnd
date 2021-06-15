import { Injectable, PipeTransform } from '@angular/core';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';

import {Producto} from '../model/producto';
import {PRODUCTOS} from '../Datos/productos';
import {DecimalPipe} from '@angular/common';
import {debounceTime, delay, switchMap, tap} from 'rxjs/operators';
import {SortColumn, SortDirection} from '../tables/sortable.directive';

interface SearchResult {
  productos: Producto[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(product: Producto[], column: SortColumn, direction: string): Producto[] {
  if (direction === '' || column === '') {
    return product;
  } else {
    return [...product].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(product: Producto, term: string, pipe: PipeTransform) {
  return product.descripcion.toLowerCase().includes(term.toLowerCase())
    || pipe.transform(product.precio_cosecha).includes(term)
    || pipe.transform(product.precio_venta).includes(term);
}

@Injectable({providedIn: 'root'})
export class ProductService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _productos$ = new BehaviorSubject<Producto[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 4,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(private pipe: DecimalPipe) {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._productos$.next(result.productos);
      this._total$.next(result.total);
    });

    this._search$.next();
  }

  get productos$() { return this._productos$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }

  set page(page: number) { this._set({page}); }
  set pageSize(pageSize: number) { this._set({pageSize}); }
  set searchTerm(searchTerm: string) { this._set({searchTerm}); }
  set sortColumn(sortColumn: SortColumn) { this._set({sortColumn}); }
  set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;

    // 1. sort
    let productos = sort(PRODUCTOS, sortColumn, sortDirection);

    // 2. filter
    productos = productos.filter(country => matches(country, searchTerm, this.pipe));
    const total = productos.length;

    // 3. paginate
    productos = productos.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({productos: productos, total});
  }
}