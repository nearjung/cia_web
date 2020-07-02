import { Component, OnInit } from '@angular/core';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { CompanyService } from '../../../service/company.service';

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

  constructor(
    private toast: ToastrService,
    private CompanyService: CompanyService,
  ) {

  }

  ngOnInit(): void {
    this.loading(false);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  companyInfo(companyId) {
    this.dataTbl = true;
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
