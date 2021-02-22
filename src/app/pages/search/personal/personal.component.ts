import { Component, OnInit } from '@angular/core';
import { PersonalService } from '../../../service/personal.service';
import { VehicleService } from '../../../service/vehicle.service';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

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
  public idCard: string;

  constructor(
    private PersonalService: PersonalService,
    private toast: ToastrService,
    private router: Router,
    private VehicleService: VehicleService
    , private routerActive: ActivatedRoute
  ) {
    if (!this.user) {
      this.router.navigate(['/login']);
      //location.reload();
      return;
    }


    this.routerActive.queryParams.subscribe(params => {
      this.searchTxt = params["searchTxt"];
      this.idCard = params["idCard"];
    });

    if (this.searchTxt) {
      this.onSubmit();
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit(): void {
    this.loading(false);
  }

  onSearch() {
    this.router.navigate(['/personal'], {
      queryParams: {
        searchTxt: this.searchTxt,
      },
    });
    this.onSubmit();
  }

  onSubmit() {
    this.dataList = [];
    this.dataTbl = false;
    this.dataTblVehicle = false;
    this.showData = true;
    this.loading(true);
    this.PersonalService.getPersonal(this.searchTxt, this.user.email, this.user.password, this.user.member_id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status == "Success") {
        if (result.serviceResult.value && result.serviceResult.value.length > 0) {
          this.dataList = result.serviceResult.value;
          this.toast.success("พบข้อมูล : " + this.dataList.length + " rows");
        } else {
          this.toast.error("ไม่พบข้อมูลในระบบ !");
        }
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
    this.loading(true);
    this.idCard = idCard;
    this.dataTbl = true;
    this.showData = true;
    this.personInfo = [];
    this.contact = [];
    this.workplace = [];
    this.PersonalService.getPersonalInfo(idCard, this.user.member_id, this.user.password).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status == "Success") {
        this.personInfo = result.serviceResult.value;
        this.loading(false);
        if (result.serviceResult.value && result.serviceResult.value.customer) {
          this.contact = result.serviceResult.value.customer;
        }
        if (result.serviceResult.value && result.serviceResult.value.working) {
          this.workplace = result.serviceResult.value.working;
        }
      }
    }, err => {
      this.loading(false);
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

  back(mode) {
    if (mode == 1) {
      this.dataTbl = false;
      this.showData = false;
    } else if (mode == 2) {
      this.dataTblVehicle = false;
      this.userInfo(this.idCard);
    }
  }


}
