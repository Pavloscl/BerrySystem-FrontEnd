import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {DecimalPipe} from '@angular/common';
import { baseURL } from './environments/baseurl'

import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { TrabajadorComponent } from './trabajador/trabajador.component';
import { ProductosComponent } from './productos/productos.component';
import { AddEditProductoComponent } from './productos/add-edit-producto/add-edit-producto.component';

import{WorkService} from './services/work.service';
import{ProductService} from './services/product.service';
import { AddEditTrabajadorComponent } from './trabajador/add-edit-trabajador/add-edit-trabajador.component';






@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    ProductosComponent,
    AddEditProductoComponent,
    TrabajadorComponent,
    AddEditTrabajadorComponent,
   
  ],
  entryComponents: [AddEditProductoComponent,AddEditTrabajadorComponent],
  imports: [
   
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    ProductService,
    DecimalPipe,
    {provide: 'baseURL', useValue: baseURL},
    WorkService
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
