import { Component, OnInit } from '@angular/core';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { CompanyService } from '../../../service/company.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolService } from '../../../service/tool.service';
import { MemberService } from '../../../service/member.service';
import { SharedService } from '../../../service/shared.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  public dataTbl: boolean = false;
  public companyData = [];
  public user: any = JSON.parse(localStorage.getItem("userData"));
  public dataValue = [];
  public creditData: any;
  public isShowList: boolean;
  public provinceList = [];
  public province: string = '';
  public companyName: string = '';
  public capital1: string = '';
  public capital2: string = '';
  public objective: string = '';

  constructor(
    private toast: ToastrService,
    private router: Router,
    private CompanyService: CompanyService,
    private MemberService: MemberService,
    private route: ActivatedRoute,
    private toolService: ToolService,
    private sharedService: SharedService
  ) {
    if (!this.user) {
      this.router.navigate(['/login']);
      //location.reload();
      return;
    }

    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {

      if (params['logMasterId']) {
        this.getListFromLog(params['logMasterId']);
      }
    });
  }

  ngOnInit(): void {
    this.loading(false);
    this.creditList();
    this.loadProvinces();
  }

  loadProvinces() {
    this.toolService.getProvinces().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status == "Success") {
        this.provinceList = result.serviceResult.value;
      }
    })
  }

  getListFromLog(logMasterId: string) {
    this.companyData = [];
    this.dataTbl = false;
    this.isShowList = false;
    this.loading(true);
    this.MemberService.getLogById(this.user.member_id, logMasterId, this.user.authority).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status == "Success") {
        var value = result.serviceResult.value;
        for (let obj of value) {
          var jsonData = JSON.parse(obj.data);
          this.companyData.push(jsonData);
        }
        // this.dataList = JSON.parse(result.serviceResult.value[0].data);
        this.isShowList = true;
      }
      this.loading(false);
    });
  }

  creditList() {
    this.MemberService.getMenuList().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status == "Success") {
        this.creditData = result.serviceResult.value[2];
      }
    })
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  companyInfo(companyId) {
    this.loading(true);
    this.dataTbl = true;
    this.CompanyService.getCompanyInfo(this.user.member_id, this.user.password, companyId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status == "Success") {
        this.dataValue = result.serviceResult.value;
      }
      this.loading(false);
    }, err => {
      this.toast.error(err);
      this.loading(false);
    })
  }

  onSubmit() {
    this.dataTbl = false;
    this.loading(true);
    this.companyData = [];
    this.CompanyService.getCompany(this.companyName, this.capital1, this.capital2, this.objective, this.province, this.user.member_id, 'Count').pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status == "Success") {
        if (+result.serviceResult.value[0][''] > 0) {
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

              this.CompanyService.getCompany(this.companyName, this.capital1, this.capital2, this.objective, this.province, this.user.member_id, 'Normal').pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
                if (result.serviceResult.status == "Success") {
                  if (result.serviceResult.value && result.serviceResult.value.length > 0) {
                    var valueData = result.serviceResult.value;
                    var price = this.creditData.menuPrice * valueData.length;
                    this.MemberService.checkPoint(this.user.member_id, this.user.password, price).subscribe(result => {
                      if (result.serviceResult.status == "Success") {
                        // Reduce Credit
                        this.MemberService.addCredit(this.user.email, price, 'reduce').subscribe(result => {
                          if (result.serviceResult.status == "Success") {
                            this.companyData = valueData;
                            var dataSend: any = {};
                            dataSend.memberId = this.user.member_id;
                            dataSend.data = this.companyData;
                            dataSend.module = "Company";

                            var dataSend: any = {};
                            dataSend.dataMaster = {
                              memberId: this.user.member_id,
                              keySearch: this.companyName + "|" + this.capital1 + "|" + this.capital2 + "|" + this.objective + "|" + this.province,
                              module: "Company"
                            };
                            dataSend.dataSub = this.companyData;
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
                    })
                  } else {
                    this.toast.error("ไม่พบข้อมูลที่ต้องการ !");
                  }
                  this.loading(false);
                }
              }, err => {
                this.toast.error(err);
                this.loading(false);
              });
            }
          });
        }
        this.loading(false);
      }
    }, err => {
      this.toast.error(err);
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
