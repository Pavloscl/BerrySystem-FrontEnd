import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { FormsModule } from '@angular/forms';
import {DecimalPipe} from '@angular/common';

import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { ProductosComponent } from './productos/productos.component';

import{ProductService} from './services/product.service';



@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    ProductosComponent
  ],
  imports: [
   
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    FormsModule

  ],
  providers: [
    ProductService,
    DecimalPipe
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
