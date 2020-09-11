import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MemberService } from '../service/member.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-active',
  templateUrl: './active.component.html',
  styleUrls: ['./active.component.scss'],
  providers: [MemberService]
})
export class ActiveComponent implements OnInit, AfterViewInit {
  private ngUnsubscribe = new Subject();
  public isLoading: boolean = false;
  public email: string;
  public password: string;
  public token: string;
  public text: string;

  constructor(
    private memberService: MemberService,
    private toast: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.token = window.location.href.split("token=")[1];
  }

  ngAfterViewInit(): void {
    this.checkActive();
  }

  ngOnInit(): void {
    localStorage.removeItem('userData');
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  checkActive() {
    if(!this.token) {
      this.router.navigate(['/login']);
      return;
    }
    this.memberService.getActive(this.token).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status == "Success") {
        this.text = 'Congratulation ! Your email has been active.';
      } else {
        this.text = result.serviceResult.text;
      }
    }, err => {
      console.log(err);
    })
  }

}
