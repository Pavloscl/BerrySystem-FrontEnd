import { Component, QueryList, ViewChildren, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, MinLengthValidator, Validators } from '@angular/forms';
import { Producto } from '../model/producto';
import { NgbdSortableHeader, SortEvent } from '../tables/sortable.directive';
import { ProductService } from '../services/product.service';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { AddEditProductoComponent } from '../productos/add-edit-producto/add-edit-producto.component';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']

})
export class ProductosComponent {

  productForm: FormGroup;
  actionType: string;
  cardErrMess: string = "";
  errorMessage: any;
  Product: Producto;
  Productos : Producto[];
  productos$: Observable<Producto[]>;
  total$: Observable<number>;
 

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(public productService: ProductService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private avRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService) {

    this.productos$ = productService.productos$;
    this.total$ = productService.total$;
  }

  loadProduct() {
    this.productos$= this.productService.getProducts();
  }

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.productService.sortColumn = column;
    this.productService.sortDirection = direction;
  }

  editItem(codigo) {
    // this.router.navigateByUrl(`EditUser/${userModel.id}`);
    const ref = this.modalService.open(AddEditProductoComponent, { centered: true });
    ref.componentInstance.postId = codigo;
    ref.result.then((yes) => {   
    },
      (cancel) => {
        
      })
  }

  addItem() {
    const ref = this.modalService.open(AddEditProductoComponent, { centered: true });
    //this.router.navigateByUrl(`addProduct`);
    ref.componentInstance.postId = 0;
    ref.result.then((yes) => {
    },
      (cancel) => {
      
      })
  }

  delete(postId:number) {
    const ans = confirm('Esta Seguro de eleminar el Registro N°: ' + postId);
    if (ans) {
      console.log(postId)
      this.productService.deleteProduct(postId).subscribe((data) => {
      //  this.loadProduct();
      this.toastr.warning('Tu Producto Fue Eliminado Correctamente','Registro Eliminado');
        
      });
    }
  }

}



