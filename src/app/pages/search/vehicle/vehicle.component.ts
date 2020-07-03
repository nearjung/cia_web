import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { VehicleService } from '../../../service/vehicle.service';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss']
})
export class VehicleComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  public searchTxt: string;
  public catagory: string = '0';
  public user: any = JSON.parse(localStorage.getItem("userData"));
  public dataTbl: boolean = false;
  public vehicleData = [];

  constructor(
    private toast: ToastrService,
    private router: Router,
    private VehicleService: VehicleService,
  ) {
    if (!this.user) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSubmit() {
    this.dataTbl = false;
    this.VehicleService.getVehicle(this.user.member_id, this.catagory, this.searchTxt).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status == "Success") {
        if (result.serviceResult.value && result.serviceResult.value.length > 0) {
          this.vehicleData = result.serviceResult.value;
        } else {
          this.toast.error("ไม่พบข้อมูลที่ค้นหา !");
        }
      } else {
        this.toast.error(result.serviceResult.text);
      }
    }, err => {
      this.toast.error(err);
    })
  }

  vehicleInfo(id) {

  }

}
