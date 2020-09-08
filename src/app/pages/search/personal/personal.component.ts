import { Component, OnInit } from '@angular/core';
import { PersonalService } from '../../../service/personal.service';
import { VehicleService } from '../../../service/vehicle.service';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  public searchTxt: string;
  public firstname: string = '';
  public lastname: string = '';
  public isLoading: boolean = false;
  public dataList = [];
  public user: any = JSON.parse(localStorage.getItem("userData"));
  public year = new Date().getFullYear();
  public dataTbl: boolean = false;
  public dataTblVehicle: boolean = false;
  public personInfo = [];
  public contact = [];
  public workplace = [];
  public vehicle = [];
  public showData: boolean = false;

  constructor(
    private PersonalService: PersonalService,
    private toast: ToastrService,
    private router: Router,
    private VehicleService: VehicleService
  ) {
    if (!this.user) {
      this.router.navigate(['/login']);
      location.reload();
      return;
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit(): void {
    this.loading(false);
  }

  onSubmit() {
    this.dataList = [];
    this.dataTbl = false;
    this.dataTblVehicle = false;
    this.showData = true;
    this.loading(true);
    if (!+this.firstname) {
      this.firstname = this.searchTxt.split(' ')[0];
      this.lastname = this.searchTxt.split(' ')[1];
    }
    this.PersonalService.getPersonal(this.firstname, this.lastname, this.user.member_id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status == "Success") {
        if (result.serviceResult.value && result.serviceResult.value.length > 0) {
          this.dataList = result.serviceResult.value;
          this.toast.success("พบข้อมูล : " + this.dataList.length + " rows");
        } else {
          this.toast.error("ไม่พบข้อมูลในระบบ !");
        }
        this.searchTxt = '';
        this.loading(false);
      } else {
        this.loading(false);
      }
    }, err => {
      this.toast.error(err);
      this.loading(false);
    })
  }

  vehicleInfo(plate1: string, plate2: string, numbody: string = '', numengine: string = '', mode: string = 'car') {
    this.dataTbl = true;
    this.dataTblVehicle = true;
    this.showData = false;
    this.personInfo = [];
    this.contact = [];
    this.workplace = [];
    this.searchTxt = '';
    this.VehicleService.getVehicleInfo(this.user.member_id, this.user.password, plate1, plate2, numbody, numengine, mode).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status == "Success") {
        this.vehicle = result.serviceResult.value;
      } else {
        this.toast.error("เกิดข้อผิดพลาดขณะรันข้อมูล !");
      }
    }, err => {
      this.toast.error(err);
    })
  }

  userInfo(idCard: string) {
    this.dataTbl = true;
    this.personInfo = [];
    this.contact = [];
    this.workplace = [];
    this.PersonalService.getPersonalInfo(idCard, this.user.member_id, this.user.password).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status == "Success") {
        this.personInfo = result.serviceResult.value;
        if (result.serviceResult.value && result.serviceResult.value.customer) {
          this.contact = result.serviceResult.value.customer;
        }
        if (result.serviceResult.value && result.serviceResult.value.working) {
          this.workplace = result.serviceResult.value.working;
        }
      }
    }, err => {
      this.toast.error(err);
    })
  }

  loading(show) {
    if (show) {
      eval("$('#hm-loading-box').show();");
    } else {
      eval("$('#hm-loading-box').fadeOut();");
    }
  }


}
