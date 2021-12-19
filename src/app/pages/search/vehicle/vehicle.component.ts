import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleService } from '../../../service/vehicle.service';
import { MemberService } from '../../../service/member.service';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ThrowStmt } from '@angular/compiler';
import { ToolService } from '../../../service/tool.service';
import Swal from 'sweetalert2'
import { SharedService } from '../../../service/shared.service';
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
  public province: string = '';
  public creditData: any;
  public isShowList: boolean = false;
  public logMasterId: Number;
  constructor(
    private toast: ToastrService,
    private router: Router,
    private MemberService: MemberService,
    private VehicleService: VehicleService,
    private toolService: ToolService,
    private sharedService: SharedService,
    private route: ActivatedRoute,
  ) {
    if (!this.user) {
      this.router.navigate(['/login']);
      //location.reload();
      return;
    }

    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
      if (params['logMasterId']) {
        this.logMasterId = params['logMasterId'];
        this.getListFromLog(params['logMasterId']);
      }
    });

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
    this.creditList();
    this.loadProvinces();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  creditList() {
    this.MemberService.getMenuList().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status == "Success") {
        this.creditData = result.serviceResult.value[0];
      }
    })
  }

  onSubmit() {
    this.loading(true);
    this.dataTbl = false;
    this.vehicleData = [];
    this.VehicleService.getVehicle(this.user.member_id, this.catagory, this.searchTxt, this.searchTxt2, this.province, 'Count').pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status == "Success") {
        if (result.serviceResult.value && result.serviceResult.value.length > 0) {
          Swal.fire({
            icon: 'success',
            title: 'พบข้อมูล : ' + result.serviceResult.value[0][''].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            text: 'รวมทั้งสิ้น : ' + (this.creditData.menuPrice * result.serviceResult.value[0]['']).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' เครดิต',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#2dbf00',
            cancelButtonColor: '#ff0000'
          }).then(result => {
            if (result.isConfirmed) {
              this.isShowList = true;

              this.loading(true);
              this.VehicleService.getVehicle(this.user.member_id, this.catagory, this.searchTxt, this.searchTxt2, this.province, 'Normal').pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
                if (result.serviceResult.status == "Success") {
                  if (result.serviceResult.value && result.serviceResult.value.length > 0) {
                    var valueData = result.serviceResult.value;
                    var price = this.creditData.menuPrice * valueData.length;
                    this.MemberService.checkPoint(this.user.member_id, this.user.password, price).subscribe(result => {
                      if (result.serviceResult.status == "Success") {
                        // Reduce Credit
                        this.MemberService.addCredit(this.user.email, price, 'reduce').subscribe(result => {
                          if (result.serviceResult.status == "Success") {
                            this.vehicleData = valueData;
                            var dataSend: any = {};
                            dataSend.dataMaster = {
                              memberId: this.user.member_id,
                              keySearch: this.searchTxt + (this.searchTxt2) ? this.searchTxt2 : '' + ' ' + (this.province) ? this.province : '',
                              module: "Vehicle"
                            };
                            dataSend.dataSub = valueData;
                            // SendLog
                            this.MemberService.sendLog(dataSend).subscribe(result => {
                            }, err => {
                              console.log("Error: " + err);
                            });

                            // Update Credit
                            this.sharedService.sendClickEvent();

                          }
                        })
                      } else {
                        Swal.fire(
                          'Error !',
                          'จำนวน Credit ไม่เพียงพอ',
                          'error'
                        )
                      }
                    });
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
              });
            }
          })
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
    });

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

  getListFromLog(logMasterId: string) {
    this.dataTbl = false;
    this.vehicleData = [];
    this.isShowList = false;
    this.loading(true);
    this.MemberService.getLogById(this.user.member_id, logMasterId, this.user.authority).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status == "Success") {
        var value = result.serviceResult.value;
        for (let obj of value) {
          var jsonData = JSON.parse(obj.data);
          this.vehicleData.push(jsonData);
        }
        this.isShowList = true;
      }
      this.loading(false);
    });
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
      this.isShowList = true;
    }
  }

}
