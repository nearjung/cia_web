import { Component, OnInit } from '@angular/core';
import { MemberService } from '../service/member.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MemberService]
})
export class LoginComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  public isLoading: boolean = false;
  public email: string;
  public password: string;

  constructor(
    private memberService: MemberService,
    private toast: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    localStorage.removeItem('userData');
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  login() {
    this.isLoading = true;
    if (!this.email || !this.password) {
      this.toast.error("กรุณากรอกข้อมูลให้ครบทุกช่อง !");
      this.isLoading = false;
    } else {
      this.memberService.userLogin(this.email, this.password).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        if (result.serviceResult.status == "Success") {
          var res = result.serviceResult.value;
          if (res.accActive == 0) {
            this.toast.error("กรุณารอการยืนยันจากทางผู้ดูแลระบบ !");
          } else if(res.emailActive == 0) {
            this.toast.error("กรุณายืนยัน Email ก่อน !");
          } else {
            var dataValue = {
              member_id: res.member_id,
              email: res.email,
              password: res.password,
              authority: res.authority,
              credit: res.credit,
              emailActive: res.emailActive,
              titleName: res.titleName,
              firstName: res.firstName,
              lastname: res.lastname,
              idcard: res.idcard,
              telephone: res.telephone,
              createDate: res.createDate,
              updateDate: res.updateDate
            }

            localStorage.setItem("userData", JSON.stringify(dataValue));
            window.location.href = "/";
            this.toast.success("เข้าสู่ระบบสำเร็จ");
          }
          this.isLoading = false;
        } else {
          this.toast.error("ชื่อบัญชีหรือรหัสผ่านผิดพลาด !");
          this.isLoading = false;
        }
      })
    }
  }

  register(){
    this.router.navigate(['/register']);
  }

  forgetpass(){
    this.router.navigate(['/forgetpass']);
  }

}
