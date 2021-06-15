import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router'
import { BrowserModule } from '@angular/platform-browser';
import { routes } from './routes';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  
})
export class AppRoutingModule { }
