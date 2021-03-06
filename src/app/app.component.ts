import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MemberService } from './service/member.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public menu: any;
  title = 'ciaweb';
  public user: any = JSON.parse(localStorage.getItem("userData"));
  public link: boolean = false;

  constructor(
    private router: Router,
    private MemberService: MemberService,
    private route: ActivatedRoute
  ) {

    if (this.user) {
      this.MemberService.getMenu(this.user.member_id).subscribe(result => {
        if (result.serviceResult.status == "Success") {
          this.menu = result.serviceResult.value;
          for (var i in this.menu) {
            this.menu[i].text = this.menu[i].MENUNAME;
            this.menu[i].link = this.menu[i].MENULINK.replace("/", "");
            this.menu[i].active = 'active';
          }
        }
      }, err => {
        console.log(err);
      });
    } else {
      this.menu = [];
    }

  }

  ngOnInit(): void {

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
    }
  }
}
