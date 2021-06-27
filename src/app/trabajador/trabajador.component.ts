
import { Component, QueryList, ViewChildren, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, MinLengthValidator, Validators } from '@angular/forms';
import { Producto } from '../model/producto';
import { NgbdSortableHeader, SortEvent } from '../tables/sortable.directive';
import { WorkService } from '../services/work.service';
import { Params, ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-trabajador',
  templateUrl: './trabajador.component.html',
  styleUrls: ['./trabajador.component.css']
})
export class TrabajadorComponent implements OnInit {

  constructor(public workService: WorkService) { }

  ngOnInit(): void {
  }

}
