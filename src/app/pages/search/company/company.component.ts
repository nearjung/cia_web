import { Component, OnInit } from '@angular/core';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { CompanyService } from '../../../service/company.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {
  public searchTxt: string = '';
  private ngUnsubscribe = new Subject();
  public dataTbl: boolean = false;
  public companyData = [];
  public user: any = JSON.parse(localStorage.getItem("userData"));
  public dataValue = [];

  constructor(
    private toast: ToastrService,
    private router: Router,
    private CompanyService: CompanyService,
  ) {
    if (!this.user) {
      this.router.navigate(['/login']);
      //location.reload();
      return;
    }
  }

  ngOnInit(): void {
    this.loading(false);
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
    this.CompanyService.getCompany(this.searchTxt).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status == "Success") {
        if (result.serviceResult.value && result.serviceResult.value.length > 0) {
          this.companyData = result.serviceResult.value;
          this.toast.success("พบข้อมูล : " + result.serviceResult.value.length + " row");
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

  loading(show) {
    if (show) {
      eval("$('#hm-loading-box').show();");
    } else {
      eval("$('#hm-loading-box').fadeOut();");
    }
  }


}
