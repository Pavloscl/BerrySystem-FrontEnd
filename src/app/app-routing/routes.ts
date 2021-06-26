import { Routes } from '@angular/router';

import { ProductosComponent } from '../productos/productos.component';
import { AddEditProductoComponent } from '../productos/add-edit-producto/add-edit-producto.component';
import { HomeComponent } from '../home/home.component';

export const routes: Routes = [
  { path: 'productos', component: ProductosComponent },
  { path: 'home', component: HomeComponent },
  { path: 'addProduct', component: AddEditProductoComponent },
  { path: 'editProduct/:id', component: AddEditProductoComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];
