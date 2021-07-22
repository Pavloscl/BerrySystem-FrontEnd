import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { WorkService } from '../../services/work.service';
import { Trabajador } from 'src/app/model/trabajador';

@Component({
  selector: 'app-add-edit-trabajador',
  templateUrl: './add-edit-trabajador.component.html',
  styleUrls: ['./add-edit-trabajador.component.css']
})
export class AddEditTrabajadorComponent implements OnInit {
  employee: Trabajador;
  //employeeCopy: Trabajador;
  errMess: string = "";

  form: FormGroup;
  actionType: string;
  existingEmployee: Trabajador;
  postId: number;
  formCorreo: string;
  formPassword: string;

  formErrors: { [key: string]: any } = {
    'password': '',
    'email': '',
  };

  validationMessages: { [Key: string]: any } = {
    'password': {
      'required': 'Password is required.',
      'minlength': 'Password  must be at least 2 characters long.',
      'maxlength': 'Password cannot be more than 25 characters long.'
    },
    'email': {
      'required': 'Email is required.',
      'minlength': 'Email must be at least 2 characters long.',
      'maxlength': 'Email cannot be more than 25 characters long.'
    }
  };
  constructor(public modal: NgbActiveModal,
    private employeeService: WorkService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService) {

    this.createForm();
    this.actionType = 'Add'
    this.formCorreo='email';
    this.formPassword='password';
  }

  ngOnInit(): void {
    this.setForm();

  }
  createForm() {
    this.form = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      email: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]]
    });
    this.form.valueChanges
      .subscribe(data => this.onValueChanged(data));
    console.log('Value form Changes  ' + this.form.valueChanges)
    this.onValueChanged(); // (re)set validation messages now
  }

  private setForm() {
    if (this.postId > 0) {
      this.actionType = 'Edit';
      this.employeeService.getEmployeeById(this.postId).subscribe(data=> (
        this.existingEmployee=data,
        this.form.controls[this.formCorreo].setValue(data.email),
        this.form.controls[this.formPassword].setValue(data.password)
        ))
    }
  }


  onValueChanged(data?: any) {
    if (!this.form) { return; }
    const form = this.form;

    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.toastr.info('Debe Ingresar Todos los Campos.','Formulario Incompleto.',{timeOut: 3500, positionClass: 'toast-top-center'});
      return
    }
    if (this.actionType === 'Add'){
      this.employee = this.form.value;
      this.employeeService.addEmployee(this.employee)
      .subscribe(data=>{
        this.employee= data;
        this.toastr.success('Trabajador Agregado Correctamente','Registro Agregado');
        //this.ngOnInit();
      })
      this.modal.close('Yes');
    }
    if (this.actionType === 'Edit'){
      this.employee = this.form.value;
      id: this.existingEmployee.id,
      this.employeeService.updateEmployee(this.existingEmployee.id,this.employee)
     .subscribe((data) => {
      this.toastr.success('Trabajador Modificado Correctamente','Registro Modificado');
    });
    this.modal.close('Yes');
    };
    
  }
}
