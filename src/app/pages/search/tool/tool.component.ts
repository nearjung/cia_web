import { Component, OnInit } from '@angular/core';
import { DownloadFileService } from 'src/app/service/download.service';
import { DatePipe } from '@angular/common';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

// Services
import { ToolService } from '../../../service/tool.service';
import { MemberService } from '../../../service/member.service';

@Component({
  selector: 'app-tool',
  templateUrl: './tool.component.html',
  styleUrls: ['./tool.component.scss'],
  providers: [DownloadFileService, DatePipe]
})
export class ToolComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  public provinceList = [];
  public amphureList = [];
  public tambonList = [];
  public informationList = [];
  public tierList = [];

  // Personal Field
  public gender = '';
  public age1 = '';
  public age2 = '';
  public car = '';
  public ensure = '';
  public email = '';
  public telephone = '';
  public yearcar = '';
  public province = '';
  public amphure = '';
  public tambon = '';

  // Company Field
  public companyType: string;
  public companyCapital: string;
  public companyProfit: string;
  public companyEmployee: string;

  // Vehicle Field
  public vehicleBrand: string;
  public vehicleModel: string;
  public vehicleRage1: string;
  public vehicleRage2: string;
  public vehicleProvince: string;


  // Use All Field
  public countData = '';


  public countDataValue;

  public priceMenuPersonal;

  public user: any = JSON.parse(localStorage.getItem("userData"));

  constructor(
    private toolService: ToolService,
    private toast: ToastrService,
    private router: Router,
    private memberService: MemberService,
    private downloadService: DownloadFileService,
  ) {
    if (!this.user) {
      this.router.navigate(['/login']);
      location.reload();
      return;
    }
    this.memberService.getMenuById('5').subscribe(result => {
      if (result.serviceResult.status == "Success") {
        this.priceMenuPersonal = result.serviceResult.value.menuPrice;
      }
    })
  }

  ngOnInit(): void {
    this.loadProvinces();
    this.loadTier();
    this.loading(false);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  loadProvinces() {
    this.toolService.getProvinces().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status == "Success") {
        this.provinceList = result.serviceResult.value;
      }
    })
  }

  loadAmphure() {
    this.toolService.getAmphure(this.province).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status == "Success") {
        this.amphureList = result.serviceResult.value;
      }
    })
  }

  loadTambon() {
    this.toolService.getTambon(this.amphure).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status == "Success") {
        this.tambonList = result.serviceResult.value;
      }
    })
  }

  loadTier() {
    this.toolService.getTier().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status == "Success") {
        this.tierList = result.serviceResult.value;
      }
    })
  }

  searchPersonal() {
    this.loading(true);
    if(!this.countData) {
      this.toast.error("กรุณากรอกจำนวนที่ต้องการ");
      this.loading(false);
      return;
    }
    this.toolService.getSearch(this.user.member_id, this.user.password, this.gender, (this.age1)?this.age1:'1', (this.age2)?this.age2:'100', this.province, this.car, this.yearcar, '', '', this.ensure, this.email
      , this.telephone, this.countData, this.tambon, this.amphure).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        if (result.serviceResult.status == "Success") {
          this.informationList = result.serviceResult.value;
          // Count
          this.toolService.getSearch(this.user.member_id, this.user.password, this.gender, (this.age1)?this.age1:'1', (this.age2)?this.age2:'100', this.province, this.car, this.yearcar, '', '', this.ensure, this.email
            , this.telephone, this.countData, this.tambon, this.amphure, '1').pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
              if (result.serviceResult.status == "Success") {
                this.countDataValue = result.serviceResult.value[0].dataLength;
                this.loading(false);
              }
            })
        }
      })
  }

  download() {
    var price = this.countDataValue * this.priceMenuPersonal;
    this.memberService.checkPoint(this.user.member_id, this.user.password, price).subscribe(result=>{
      if(result.serviceResult.status == "Success") {
        this.memberService.addCredit(this.user.email, price, 'reduce').subscribe(result=>{
          if(result.serviceResult.status == "Success") {
            return this.downloadService.downloadFile(this.informationList);
          } else {
            this.toast.error(result.serviceResult.text);
          }
        }, err=> {
          console.log(err);
        })
      } else {
        this.toast.error(result.serviceResult.text);
      }
    }, err=> {
      console.log(err);
    })
  }

  searchCompany() {

  }

  searchVehicle() {
    
  }

  loading(show) {
    if (show) {
      eval("$('#hm-loading-box').show();");
    } else {
      eval("$('#hm-loading-box').fadeOut();");
    }
  }

}
