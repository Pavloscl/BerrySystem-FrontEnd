import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ProductService } from '../../services/product.service';
import { Producto } from 'src/app/model/producto';

@Component({
  selector: 'app-add-edit-producto',
  templateUrl: './add-edit-producto.component.html',
  styleUrls: ['./add-edit-producto.component.css']
})
export class AddEditProductoComponent implements OnInit {
  editForm: FormGroup;
  isLoading = false;

  producto: Producto;
  formProduct: string;
  formPrecioCompra: string;
  formPrecioVenta: string;
  formPrecioCosecha: string;
  actionType: string;
  existingProduct: Producto;
  postId: number;

  constructor(private productService: ProductService,
    public modal: NgbActiveModal,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router) 
    {
    
    this.actionType = 'Add'
    this.formProduct = 'producto_desc'
    this.formPrecioCosecha = 'precio_cosecha';
    this.formPrecioCompra = 'precio_compra';
    this.formPrecioVenta = 'precio_venta';

    this.createForm();
  }
  ngOnInit(): void {

   
    
    if (this.postId > 0) {
      this.actionType = 'Edit';
      this.productService.getProductById(this.postId)
        .subscribe(data => (

          this.existingProduct = data,
          console.log(data),
          this.editForm.controls[this.formProduct].setValue(data.descripcion),
          this.editForm.controls[this.formPrecioCompra].setValue(data.precio_compra),
          this.editForm.controls[this.formPrecioVenta].setValue(data.precio_venta),
          this.editForm.controls[this.formPrecioCosecha].setValue(data.precio_cosecha)

        ));
      this.editForm.controls['producto_desc'].disable();
    }
  }
  get editFormData() { return this.editForm.controls; }

createForm(){
this.editForm = this.formBuilder.group(
  {
    producto_desc:['',[Validators.required]],
    precio_compra: ['',[Validators.required]],
    precio_venta:['',[Validators.required]],
    precio_cosecha: ['',[Validators.required]]
  }
)}


  save() {

    if (this.editForm.invalid || this.isLoading) {
      return;
    }
    this.isLoading = true;

    if (this.actionType === 'Add') {
      console.log(this.actionType, this.postId)
      let producto: Producto = {

        descripcion: this.editForm.get(this.formProduct).value,
        precio_compra: this.editForm.get(this.formPrecioCompra).value,
        precio_venta: this.editForm.get(this.formPrecioVenta).value,
        precio_cosecha: this.editForm.get(this.formPrecioCosecha).value

      };
      this.productService.addProduct(producto)
        .subscribe((data) => {
          //this.router.navigate(['/blogpost', data.postId]);
          console.log(producto)
        });
        this.isLoading = false;
      this.modal.close('Yes');
    }
    if (this.actionType === 'Edit') {

      console.log(this.actionType, this.existingProduct.id)
      let producto: Producto = {
        id: this.existingProduct.id,
        descripcion: this.editForm.get(this.formProduct).value,
        precio_compra: this.editForm.get(this.formPrecioCompra).value,
        precio_venta: this.editForm.get(this.formPrecioVenta).value,
        precio_cosecha: this.editForm.get(this.formPrecioCosecha).value,

      };
      this.productService.updateProduct(producto.id, producto)
        .subscribe((data) => {
          //this.router.navigate([this.router.url]);
        });
      this.modal.close('Yes');
    }
  }
}
