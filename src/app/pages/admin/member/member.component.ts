import { Component, OnInit } from '@angular/core';
import { MemberService } from '../../../service/member.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as Parser from 'json2csv';
import { DownloadFileService } from 'src/app/service/download.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2'
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss'],
  providers: [DownloadFileService, DatePipe]
})
export class MemberComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  public filterdata: string = 'All';
  public memberDataList = [];
  public filterMember = [];
  public memberInformation = [];
  public paged: string = 'main';
  public creditamount;
  public user: any = JSON.parse(localStorage.getItem("userData"));
  public activeMenuList = [];
  public disableMenuList = [];
  public creditData = [];
  public menuInfo = [];
  public apiList = [];
  public chubbList = new chubbData();

  // Field
  public menuName;
  public menuLink;
  public menuPrice;

  // Field
  public email: string;
  public pass1: string;
  public pass2: string;
  public titleName: string;
  public fullName: string;
  public idCard: string;
  public telephone: string
  public creditUser: number;

  constructor(
    private MemberService: MemberService,
    private toast: ToastrService,
    private router: Router,
    private downloadService: DownloadFileService,
    private datePipe: DatePipe
  ) {
    if (!this.user) {
      this.router.navigate(['/login']);
      //location.reload();
      return;
    }
    this.getMember();
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getMember() {
    this.loading(true);
    this.memberDataList = [];
    this.MemberService.getAllMember().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status == "Success") {
        this.memberDataList = result.serviceResult.value;
        this.filterMember = result.serviceResult.value;
      }
      this.loading(false);
    }, err => {
      this.toast.error(err);
      this.loading(false);
    })
  }

  onMember(status) {
    if (status == "Confirm") {
      this.filterMember = this.memberDataList.filter(x => x.accActive == 1);
    } else if (status == "NotConfirm") {
      this.filterMember = this.memberDataList.filter(x => x.accActive == 0);
    } else {
      this.filterMember = this.memberDataList;
    }
  }

  memberInfo(memberId) {
    this.paged = "memberInfo";
    this.MemberService.getMemberInfo(memberId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status == "Success") {
        this.memberInformation = result.serviceResult.value;
        this.getMenuManagement(memberId);
      }
    })
  }

  getMenuManagement(memberId) {
    this.MemberService.getActiveMenu(memberId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status == "Success") {
        this.activeMenuList = result.serviceResult.value;
      }
    })

    this.MemberService.getDisableMenu(memberId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status == "Success") {
        this.disableMenuList = result.serviceResult.value;
      }
    })
  }

  addCredit(email, memberId) {
    this.MemberService.addCredit(email, this.creditamount).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status == "Success") {
        this.toast.success("อัพเดทข้อมูลสำเร็จ");
        this.memberInfo(memberId);
      }
    })
  }


  menuEdit(mode, memberId, menuId) {
    this.MemberService.manageMenu(mode, memberId, menuId, this.user.member_id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status == "Success") {
        this.toast.success("บันทึกสำเร็จ");
        this.getMenuManagement(memberId);
      }
    })
  }

  loading(show) {
    if (show) {
      eval("$('#hm-loading-box').show();");
    } else {
      eval("$('#hm-loading-box').fadeOut();");
    }
  }

  onPage(page) {
    if (page == 'main') {
      this.paged = 'main';
    } else if (page == 'manageprice') {
      this.paged = 'manageprice';
      this.creditList();
    } else if (page == 'apilog') {
      this.paged = 'apilog';
      this.getApi();
    }
  }

  creditList() {
    this.MemberService.getMenuList().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status == "Success") {
        this.creditData = result.serviceResult.value;
      }
    })
  }

  editMenu(menuId) {
    this.paged = "editMenu";
    this.MemberService.getMenuById(menuId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status == "Success") {
        this.menuInfo = result.serviceResult.value;
      }
    })
  }

  updateMenu(menuId) {
    this.MemberService.updateMenu(menuId, this.menuInfo["menuName"], this.menuInfo["menuLink"], this.menuInfo["menuPrice"]).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status == "Success") {
        this.toast.success("บันทึกสำเร็จ");
        this.onPage("manageprice");
      }
    }, err => {
      this.toast.error(err);
    })
  }

  getApi() {
    this.MemberService.getApi().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status == "Success") {
        this.apiList = result.serviceResult.value;
      }
    }, err => {
      this.toast.error(err);
    })
  }

  getApiLog(cert) {
    this.MemberService.getApiLog(cert).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status == "Success") {
        var value = result.serviceResult.value;
        var val = [];

        // for(var i = 0; i < value.length; i++) {
        //   JSON
        // }
        if (cert == 'GACC369200') {
          for (var index in value) {
            value[index].PLATE1 = JSON.parse(value[index].data).PLATE1;
            value[index].PLATE2 = JSON.parse(value[index].data).PLATE2;
            value[index].PROVINCE = JSON.parse(value[index].data).PROVINCE;
            value[index].createDate = this.datePipe.transform(value[index].createDate, 'yyyy-MM-dd hh:mm:ss');
            value[index].status = value[index].status;
          }
          val = value;
          return this.downloadService.downloadFile(val);
        } else {
          return this.downloadService.downloadFile(value);
        }
      }
    }, err => {
      this.toast.error(err);
    })
  }

  confirm(memberId) {
    if (!memberId) {
      this.toast.error("เกิดข้อผิดพลาดขณะรันข้อมูล !");
    } else {
      Swal.fire({
        title: 'ยืนยัน?',
        text: "คุณต้องการยืนยันบัญชีนี้หรือไม่ ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก'
      }).then((result) => {
        if (result.value) {
          this.MemberService.confirmUser(memberId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
            if (result.serviceResult.status == "Success") {
              Swal.fire(
                'ยืนยัน!',
                'ยืนยันสำเร็จ !',
                'success'
              )
              this.getMember();
            }
          })
        }
      })
    }
  }

  submit() {
    this.loading(true);
    if (!this.idCard || !this.email || !this.titleName || !this.fullName || !this.telephone) {
      this.toast.error("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      this.loading(false);
    } else if (this.pass1 != this.pass2) {
      this.toast.error("รหัสผ่านไม่ตรงกัน");
      this.loading(false);
    } else {
      var token = uuidv4();
      this.MemberService.register(this.email, this.pass2, this.titleName, this.fullName, this.idCard, this.telephone, token, this.creditUser).subscribe(result => {
        if (result.serviceResult.status == "Success") {
              this.toast.success("ลงทะเบียนสำเร็จ");
              this.loading(false);
              this.getMember();
        } else {
          this.toast.error(result.serviceResult.text);
          this.loading(false);
        }
      }, err => {
        console.log(err);
        this.loading(false);
      })
    }
  }

}

export class chubbData {
  public PLATE1: string;
  public PLATE2: string;
  public PROVINCE: string;
  public createDate: string;
  public status: string;
}
