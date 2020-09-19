import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MemberService } from '../service/member.service';
import { ConfigServerService } from '../core/config-server.service';
import { v4 as uuidv4 } from 'uuid';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'forgetpass',
  templateUrl: './forgetpass.component.html',
  styleUrls: ['./forgetpass.component.scss']
})
export class ForgetpassComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  public isLoading: boolean = false;
  public isDesktop;

  public user = JSON.parse(localStorage.getItem("userData"));

  // Field
  public email: string;
  public idCard: string;

  public tbl: boolean = false;

  constructor(
    private deviceService: DeviceDetectorService,
    private router: Router,
    private toast: ToastrService,
    private memberService: MemberService,
    private configService: ConfigServerService
  ) {

  }

  ngOnInit(): void {
    this.isDesktop = this.deviceService.isDesktop();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  submit() {
    this.loading(true);
    this.memberService.chkResetPass(this.email, this.idCard).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status == "Success") {
        this.tbl = true;
        this.loading(false);
      } else {
        this.toast.error("อีเมลหรือบัตรประชาชนไม่ตรงกัน");
        this.loading(false);
      }
    }, err => {
      console.log(err);
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
