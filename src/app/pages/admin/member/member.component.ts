import { Component, OnInit } from '@angular/core';
import { MemberService } from '../../../service/member.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as Parser from 'json2csv';
import { DownloadFileService } from 'src/app/service/download.service';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss'],
  providers: [DownloadFileService]
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

  // Field
  public menuName;
  public menuLink;
  public menuPrice;

  constructor(
    private MemberService: MemberService,
    private toast: ToastrService,
    private router: Router,
    private downloadService: DownloadFileService
  ) {
    if (!this.user) {
      this.router.navigate(['/login']);
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
        return this.downloadService.downloadFile(result.serviceResult.value);
      }
    }, err => {
      this.toast.error(err);
    })
  }

  

}
