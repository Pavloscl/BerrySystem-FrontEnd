

import {Component, QueryList, ViewChildren} from '@angular/core';
import {Observable} from 'rxjs';

import { Producto } from '../model/producto';
import {NgbdSortableHeader, SortEvent} from '../tables/sortable.directive';
import {ProductService} from '../services/product.service';


@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
 
})
export class ProductosComponent  {

  productos$: Observable<Producto[]>;
  total$: Observable<number>;
  
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
 
  constructor(public service: ProductService) {
    this.productos$ = service.productos$;
    this.total$ = service.total$;
  }

  onSort({column, direction}: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
 
  }



