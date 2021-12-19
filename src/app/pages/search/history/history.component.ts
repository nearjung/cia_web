import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleService } from '../../../service/vehicle.service';
import { MemberService } from '../../../service/member.service';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ThrowStmt } from '@angular/compiler';
import { ToolService } from 'src/app/service/tool.service';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  public user: any = JSON.parse(localStorage.getItem("userData"));
  public provinceList = [];
  public dataList: any = [];
  public memberId: string = null;
  constructor(
    private toast: ToastrService,
    private router: Router,
    private MemberService: MemberService,
    private VehicleService: VehicleService,
    private toolService: ToolService,
    private route: ActivatedRoute,

  ) {
    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.user.authority == 'Admin') {
      this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
        if (params['memberId']) {
          this.memberId = params['memberId'];
          this.getListFromLog(params['memberId']);
        }
      });
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
    if (!this.memberId) {
      this.getListFromLog();
    }
  }

  getListFromLog(memberId: string = null) {
    this.loading(true);
    this.MemberService.getLogMaster((memberId) ? memberId : this.user.member_id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status == "Success") {
        this.dataList = result.serviceResult.value;
      }
      this.loading(false);
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  loading(show) {
    if (show) {
      eval("$('#hm-loading-box').show();");
    } else {
      eval("$('#hm-loading-box').fadeOut();");
    }
  }

  logWatch(id: string, module: string) {
    if (module == 'Personal') {
      this.router.navigate(['/personal'], { queryParams: { logMasterId: id } });
    } else if (module == 'Vehicle') {
      this.router.navigate(['/vehicle'], { queryParams: { logMasterId: id } });
    } else if (module == 'Company') {
      this.router.navigate(['/company'], { queryParams: { logMasterId: id } });
    }
  }

  back(mode) {
    // if (mode == 1) {
    //   this.dataTbl = false;
    //   this.isShowList = true;
    // }
  }

}
