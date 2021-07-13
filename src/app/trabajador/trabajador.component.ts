
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, MinLengthValidator, Validators } from '@angular/forms';
import { WorkService } from '../services/work.service';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

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

  constructor(public workService: WorkService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.workService.getEmployees()
      .subscribe(data => this.employees = data,
        errmess => this.errMess = <any>errmess);

  }

  addItem() {
    console.log();
    const ref = this.modalService.open(AddEditTrabajadorComponent, { centered: true });
    //this.router.navigateByUrl(`addProduct`);
    ref.componentInstance.postId = 0;
    ref.result.then((yes) => {
      this.setUsersList();
    },
      (cancel) => {

      })
  }


  deleteItem(employee: Trabajador) {
    const ans = confirm('Esta Seguro de eleminar el Usuario: ' + employee.email);
    if (ans) {
      console.log(employee);
      this.workService.deleteEmployee(employee.id).subscribe(x => this.setUsersList());
    }

  }

  editItem(codigo) {
    // this.router.navigateByUrl(`EditUser/${userModel.id}`);

    const ref = this.modalService.open(AddEditTrabajadorComponent, { centered: true });
     ref.componentInstance.postId = codigo;

    ref.result.then((yes) => {
      console.log("Yes Click");

      this.setUsersList();
    },
      (cancel) => {
        console.log("Cancel Click");

      })
  }

  private setUsersList() {
    this.workService.getEmployees().subscribe(x => {
      this.employees = x;
    })
  }

}
