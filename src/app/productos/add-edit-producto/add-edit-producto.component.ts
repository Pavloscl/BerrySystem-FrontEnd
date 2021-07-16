import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ProductService } from '../../services/product.service';
import { Producto } from 'src/app/model/producto';

@Component({
  selector: 'app-add-edit-producto',
  templateUrl: './add-edit-producto.component.html',
  styleUrls: ['./add-edit-producto.component.css']
})
export class AddEditProductoComponent implements OnInit {
  productForm: FormGroup;
  submitted= false; // variable tutorial;
  spinner= false;

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
    private router: Router,
    private toastr: ToastrService) 
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
          this.productForm.controls[this.formProduct].setValue(data.descripcion),
          this.productForm.controls[this.formPrecioCompra].setValue(data.precio_compra),
          this.productForm.controls[this.formPrecioVenta].setValue(data.precio_venta),
          this.productForm.controls[this.formPrecioCosecha].setValue(data.precio_cosecha)
          
        ));
       
      this.productForm.controls['producto_desc'].disable();
    }
  }
  get editFormData() { return this.productForm.controls; }

createForm(){
this.productForm = this.formBuilder.group(
  {
    producto_desc:['',[Validators.required,Validators.minLength(4)]],
    precio_compra: ['',[Validators.required,Validators.maxLength(2)]],
    precio_venta:['',[Validators.required,Validators.minLength(3),Validators.min(3)]],
    precio_cosecha: ['',[Validators.required]]
  }
)}

  save() {
    this.submitted= true;
    //this.isLoading=true;
    if (this.productForm.invalid || this.isLoading) {
      this.toastr.info('Debe Ingresar Todos los Campos requeridos.','Formulario Incompleto.',{timeOut: 3500, positionClass: 'toast-top-center'});
      return;
    }
    this.isLoading = true;
  
    if (this.actionType === 'Add') {
      let producto: Producto = {

        descripcion: this.productForm.get(this.formProduct).value,
        precio_compra: this.productForm.get(this.formPrecioCompra).value,
        precio_venta: this.productForm.get(this.formPrecioVenta).value,
        precio_cosecha: this.productForm.get(this.formPrecioCosecha).value

      };
      this.spinner= true;
      this.productService.addProduct(producto)
        .subscribe((data) => {
          this.toastr.success('Tu Producto Fue Agregado Correctamente','Registro Agregado');
          //this.router.navigate(['/blogpost', data.postId]);
        });
        this.spinner=false;
        this.isLoading = false;
      this.modal.close('Yes');
    }
    if (this.actionType === 'Edit') {

      console.log(this.actionType, this.existingProduct.id)
      let producto: Producto = {
        id: this.existingProduct.id,
        descripcion: this.productForm.get(this.formProduct).value,
        precio_compra: this.productForm.get(this.formPrecioCompra).value,
        precio_venta: this.productForm.get(this.formPrecioVenta).value,
        precio_cosecha: this.productForm.get(this.formPrecioCosecha).value,

      };
      this.productService.updateProduct(producto.id, producto)
        .subscribe((data) => {
          this.toastr.success('Tu Producto Fue Modificado Correctamente','Registro Modificado');
          //this.router.navigate([this.router.url]);
        });
      this.modal.close('Yes');
    }
  }

  onReset() {
    this.submitted = false;
    this.productForm.reset();
  }

}
