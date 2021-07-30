import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


import { WorkService } from '../../services/work.service';
import { Trabajador } from 'src/app/model/trabajador';
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-add-edit-trabajador',
  templateUrl: './add-edit-trabajador.component.html',
  styleUrls: ['./add-edit-trabajador.component.css']
})
export class AddEditTrabajadorComponent implements OnInit {
  employee: Trabajador;
  errMess: string = "";
  submitted = false;

  form: FormGroup;
  actionType: string;
  existingEmployee: Trabajador;
  postId: number;

  formRut: string;
  formNombre: string;
  formApPaterno:string;
  formApMaterno:string;
  formIdSector: string;
  formFono: string;
  formEmail: string;
  formFechaIngreso: string;
  formFechaBaja: string;

  date:Date;

  constructor(public modal: NgbActiveModal,
    private employeeService: WorkService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public datepipe: DatePipe) {

    this.createForm();
    this.actionType = 'Add'
    this.formRut='rut';
    this.formNombre='nombre';
    this.formApPaterno='ap_paterno';
    this.formApMaterno='ap_materno';
    this.formIdSector='id_sector';
    this.formFono='telefono';
    this.formEmail='email';
    this.formFechaBaja='fecha_baja';
    this.formFechaIngreso='fecha_ingreso'
  }

  ngOnInit(): void {

    this.setForm(); 
  }
  
  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  createForm() {
    this.form = this.formBuilder.group({
      rut:['',[Validators.required,Validators.minLength(9)]],
      nombre:['',[Validators.required,Validators.minLength(3),Validators.maxLength(10)]],
      ap_paterno:['',[Validators.required]],
      ap_materno:['',[Validators.required]],
      id_sector:['',[Validators.required]],
      telefono:['',[Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      fecha_ingreso:'',
      fecha_baja:''
     // dob: ['', [Validators.required, Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)]],  //patron fecha nacimiento
    });
    
  }

  private setForm() {
    if (this.postId > 0) {
      this.actionType = 'Edit';
      this.employeeService.getEmployeeById(this.postId).subscribe(data=> (
       
        this.existingEmployee=data,
        this.form.controls[this.formRut].setValue(data.rut),
        this.form.controls[this.formNombre].setValue(data.nombre),
        this.form.controls[this.formApPaterno].setValue(data.ap_paterno),
        this.form.controls[this.formApMaterno].setValue(data.ap_materno),
        this.form.controls[this.formIdSector].setValue(data.id_sector),
        this.form.controls[this.formFono].setValue(data.telefono),
        this.form.controls[this.formEmail].setValue(data.email),
        this.form.controls[this.formFechaIngreso].setValue(data.fecha_ingreso.toLocaleString()),
        this.form.controls[this.formFechaBaja].setValue(data.fecha_baja)
        ));
        this.form.controls['rut'].disable();
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      this.toastr.info('Debe Ingresar Todos los Campos.','Formulario Incompleto.',{timeOut: 3500, positionClass: 'toast-top-center'});
      return
    }
    if (this.actionType === 'Add'){
      this.employee = this.form.value;
      this.employee.fecha_ingreso=this.datepipe.transform(new Date(), 'yyyy-MM-dd');
      this.employee.fecha_baja=null;
      
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
      this.employee.rut= this.form.get(this.formRut).value
      id: this.existingEmployee.id,
      this.employeeService.updateEmployee(this.existingEmployee.id,this.employee)
     .subscribe((data) => {
      this.toastr.success('Trabajador Modificado Correctamente','Registro Modificado');
    });
    this.modal.close('Yes');
    };
    
  }
}
