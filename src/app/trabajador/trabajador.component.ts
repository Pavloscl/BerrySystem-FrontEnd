
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, MinLengthValidator, Validators } from '@angular/forms';
import { WorkService } from '../services/work.service';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { AddEditTrabajadorComponent } from '../trabajador/add-edit-trabajador/add-edit-trabajador.component';
import { Producto } from '../model/producto';
import { Trabajador } from '../model/trabajador';

@Component({
  selector: 'app-trabajador',
  templateUrl: './trabajador.component.html',
  styleUrls: ['./trabajador.component.css']
})
export class TrabajadorComponent implements OnInit {

  employees: Trabajador[];
  errMess: string = "";
  page = 1;
  count = 0;
  tableSize = 10;
  tableSizes = [5, 10, 15];
  searchTerm: string;

  constructor(public workService: WorkService,
    private modalService: NgbModal,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.fetchEmployees();

  }

  addItem() {
    console.log();
    const ref = this.modalService.open(AddEditTrabajadorComponent, {size: 'lg',centered: true });
    //this.router.navigateByUrl(`addProduct`);
    ref.componentInstance.postId = 0;
    ref.result.then((yes) => {
      this.setEmployeeList();
    },
      (cancel) => {

      })
  }

  deleteItem(employee: Trabajador) {
    const ans = confirm('Esta Seguro de eleminar el Usuario: ' + employee.nombre);
    if (ans) {
      this.workService.deleteEmployee(employee.id)
      .subscribe(x => this.setEmployeeList());
      this.toastr.info('El Trabajador Fue Eliminado Correctamente','Registro Eliminado');
    }

  }

  editItem(codigo) {
    // this.router.navigateByUrl(`EditUser/${userModel.id}`);

    const ref = this.modalService.open(AddEditTrabajadorComponent, { size: 'lg' ,centered: true });
     ref.componentInstance.postId = codigo;

    ref.result.then((yes) => {
      console.log("Yes Click");

      this.setEmployeeList();
    },
      (cancel) => {
        console.log("Cancel Click");

      })
  }

  private setEmployeeList() {
    this.workService.getEmployees().subscribe(x => {
      this.employees = x;
    })
  }

  fetchEmployees(): void {
    this.workService.getEmployees()
    .subscribe(data => this.employees = data,
      errmess => this.errMess = <any>errmess);

  }

  onTableDataChange(event){
    this.page = event;
    this.fetchEmployees();
  }  

  onTableSizeChange(event): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.fetchEmployees();
  }  

  Search(){
    if(this.searchTerm==""){
      this.ngOnInit();
    } else{
      this.employees= this.employees.filter(res=>{
        return res.nombre.toLocaleLowerCase().match(this.searchTerm.toLocaleLowerCase())
      })
    }
  }

  key: string = 'id';
  reverse:boolean = false;
  sort(key){
    this.key= key;
    this.reverse= !this.reverse;
  }
}
