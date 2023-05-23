import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MemberService } from './service/member.service';
import { userInfo } from './core/middleclass';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs'
import { SharedService } from './service/shared.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private ngUnsubscribe = new Subject();
  clickEventSubscription: Subscription;

  public menu: any;
  title = 'ciaweb';
  public user: any = JSON.parse(localStorage.getItem("userData"));
  public link: boolean = false;
  public sideMenu: boolean = false;
  public credit: number;

  constructor(
    private router: Router,
    private memberService: MemberService,
    private route: ActivatedRoute,
    private toast: ToastrService,
    private sharedService: SharedService
  ) {
    this.clickEventSubscription = this.sharedService.getClickEvent().subscribe(() => {
      this.getUser();
    })
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit(): void {
    // console.log(userInfo);

    if (!this.user) {
      this.router.navigate(['/login']);
    } else {
      this.getUser();
    }
  }

  getUser() {
    const user = this.memberService.getMemberInfo(this.user.member_id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status == "Success") {
        userInfo.credit = +result.serviceResult.value.credit;
        this.credit = userInfo.credit;
      }
    }, err => {
      this.toast.error("Authentication Error.");
      this.router.navigate(['/login']);
    });
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
