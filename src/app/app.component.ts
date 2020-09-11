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

  constructor(
    private router: Router,
    private MemberService: MemberService,
    private route: ActivatedRoute
    ) {
    if (!this.user) {
      this.router.navigate(['/active']);
      return;
    } else {
      this.MemberService.getMenu(this.user.member_id).subscribe(result => {
        if (result.serviceResult.status == "Success") {
          this.menu = result.serviceResult.value;
          for (var i in this.menu) {
            this.menu[i].text = this.menu[i].menuName;
            this.menu[i].link = this.menu[i].menuLink.replace("/", "");
            this.menu[i].active = 'active';
          }
          this.menu.push({ 'text': 'Logout', 'link': 'login', 'active': '' });
        }
      })
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
