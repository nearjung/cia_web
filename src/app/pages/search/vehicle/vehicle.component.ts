import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { VehicleService } from '../../../service/vehicle.service';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ThrowStmt } from '@angular/compiler';
import { ToolService } from 'src/app/service/tool.service';
@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss']
})
export class VehicleComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  public searchTxt: string;
  public searchTxt2: string;
  public catagory = '0';
  public user: any = JSON.parse(localStorage.getItem("userData"));
  public dataTbl: boolean = false;
  public vehicleData = [];
  public vehicle = [];
  public provinceList = [];
  public province: string;

  constructor(
    private toast: ToastrService,
    private router: Router,
    private VehicleService: VehicleService,
    private toolService: ToolService

  ) {
    if (!this.user) {
      this.router.navigate(['/login']);
      location.reload();
      return;
    }
  }

  loadProvinces() {
    this.toolService.getProvinces().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status == "Success") {
        this.provinceList = result.serviceResult.value;
      }
    })
  }

  ngOnInit(): void {
    this.loading(false);
    this.loadProvinces();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSubmit() {
    this.loading(true);
    this.dataTbl = false;
    this.VehicleService.getVehicle(this.user.member_id, this.catagory, this.searchTxt, this.searchTxt2, this.province).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status == "Success") {
        if (result.serviceResult.value && result.serviceResult.value.length > 0) {
          this.toast.success("พบข้อมูลทั้งหมด : " + result.serviceResult.value.length);
          this.vehicleData = result.serviceResult.value;
        } else {
          this.toast.error("ไม่พบข้อมูลที่ค้นหา !");
        }
        this.loading(false);
      } else {
        this.toast.error(result.serviceResult.text);
        this.loading(false);
      }
    }, err => {
      this.toast.error(err);
      this.loading(false);
    })
  }

  vehicleInfo(plate1: string, plate2: string, numbody: string = '', numengine: string = '', mode: string = 'car') {
    this.dataTbl = true;
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

  loading(show) {
    if (show) {
      eval("$('#hm-loading-box').show();");
    } else {
      eval("$('#hm-loading-box').fadeOut();");
    }
  }

}
