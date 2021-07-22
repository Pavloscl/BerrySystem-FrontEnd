import { Component, QueryList, ViewChildren, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {  FormGroup } from '@angular/forms';
import { Producto } from '../model/producto';

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
  searchTerm: string;
  page = 1;
  pageSize = 10;
  collectionSize: number;
  currentRate = 8;
 

  productForm: FormGroup;
  actionType: string;
  errMess: string = "";
  errorMessage: any;
  allProductos: Producto [];
  Productos : Producto [];
  productos$: Observable<Producto[]>;
  total$: Observable<number>;
 
  constructor(public productService: ProductService,
    private modalService: NgbModal,
    private toastr: ToastrService) {
  }
  ngOnInit(): void {
    this.loadProduct();

  }
  loadProduct() {
    this.productService.getProducts()
    .subscribe((data: Producto[]) => {
      this.collectionSize = data.length;
      this.Productos = data;
      this.allProductos = this.Productos; 
    });
  }

  editItem(codigo) {
    // this.router.navigateByUrl(`EditUser/${userModel.id}`);
    const ref = this.modalService.open(AddEditProductoComponent, { centered: true });
    ref.componentInstance.postId = codigo;
    ref.result.then((yes) => {   
      this.loadProduct();
    },
      (cancel) => {
        
      })
  }

  addItem() {
    const ref = this.modalService.open(AddEditProductoComponent, { centered: true });
    //this.router.navigateByUrl(`addProduct`);
    ref.componentInstance.postId = 0;
    ref.result.then((yes) => {
      this.loadProduct();
    },
      (cancel) => {
      
      })
  }

  delete(producto:Producto) {
    const ans = confirm('Esta Seguro de eleminar el Producto : ' + producto.descripcion);
    if (ans) {
      this.productService.deleteProduct(producto.id).subscribe((data) => {
      this.loadProduct();
      this.toastr.warning('Tu Producto Fue Eliminado Correctamente','Registro Eliminado');
        
      });
    }
  }

  search(value: string): void {
    this.Productos = this.allProductos.filter((val) => val.descripcion.toLowerCase().includes(value));
    this.collectionSize = this.Productos.length;
  }

}



