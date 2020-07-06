import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public menu: any;
  title = 'ciaweb';
  public user = localStorage.getItem("userData");

  constructor(
    private router: Router
  ) {
    this.menu = [
      { 'text': 'Home', 'link': 'home', 'active': 'active' },
      { 'text': 'Personal Search', 'link': 'personal', 'active': '' },
      { 'text': 'Company Search', 'link': 'company', 'active': '' },
      { 'text': 'Vehicle Search', 'link': 'vehicle', 'active': '' },
      { 'text': 'Search Tools', 'link': 'tool', 'active': '' },
      { 'text': 'Admin Panel', 'link': 'admin', 'active': '' },
    ]

    if(!this.user) {
      this.router.navigate(['/login']);
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
    }
  }
}
