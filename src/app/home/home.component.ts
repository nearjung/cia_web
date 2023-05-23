import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MemberService } from '../service/member.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  public isLoading: boolean = false;
  public isDesktop;

  public user = JSON.parse(localStorage.getItem("userData"));
  public activeMenuList = [];
  public menuActive = {
    personal: false,
    vehicle: false,
    company: false
  }

  constructor(
    private deviceService: DeviceDetectorService,
    private router: Router,
    private memberService: MemberService,
  ) {
    var token = this.user.tokenExpire + '000';
    if (!this.user) {
      this.router.navigate(['/login']);
      //location.reload();
      return;
    } else if (+token < +new Date()) {
      Swal.fire(
        'Error !',
        'Token Expired.',
        'error'
      ).then(ok => {
        if (ok.isConfirmed) {
          this.router.navigate(['/login']);
        }
      })
      //location.reload();
      return;
    }

  }

  ngOnInit(): void {
    this.isDesktop = this.deviceService.isDesktop();

    if (this.user.authority != 'Admin') {
      this.memberService.getActiveMenu(this.user.member_id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        if (result.serviceResult.status == "Success") {
          this.activeMenuList = result.serviceResult.value;
          this.menuActive.company = (this.activeMenuList.filter(x => x['menuId'] == '3').length > 0) ? true : false;
          this.menuActive.personal = (this.activeMenuList.filter(x => x['menuId'] == '2').length > 0) ? true : false;
          this.menuActive.vehicle = (this.activeMenuList.filter(x => x['menuId'] == '4').length > 0) ? true : false;
        }
      })
    }
  }

  navigate(page) {
    if (page == "personal") {
      this.router.navigate(['/personal']);
    } else if (page == "home") {
      this.router.navigate(['/']);
    } else if (page == "vehicle") {
      this.router.navigate(['/vehicle']);
    } else if (page == "company") {
      this.router.navigate(['/company']);
    } else if (page == "tool") {
      this.router.navigate(['/tool']);
    } else if (page == "admin") {
      this.router.navigate(['/admin']);
    } else if (page == "login") {
      this.router.navigate(['/login']);
    } else if (page == "profile") {
      this.router.navigate(['profile']);
    } else if (page == "history") {
      this.router.navigate(['history']);
    } else if (page == "excelsearch") {
      this.router.navigate(['excelsearch']);
    } else if (page == "phone") {
      this.router.navigate(['phone']);
    }
  }
}
