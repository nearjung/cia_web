import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})

export class AppComponent {
  public menu: any;
  public advertise: any;
  public popular: any;
  public left: any;
  public right: any;

  constructor(
    private router: Router
  ) {
    this.menu = [
      {'text': 'Home', 'link': 'home', 'active': 'active'},
      {'text': 'Personal Search', 'link': 'personal', 'active': ''},
      {'text': 'Company Search', 'link': '', 'active': ''},
      {'text': 'Vehicle Search', 'link': '', 'active': ''},
      {'text': 'Admin Panel', 'link': '', 'active': ''},
    ]

  }

  ngOnInit(): void {
  }

  
  navigate(page) {
    if(page == "personal") {
      this.router.navigate(['/personal']);
    } else if(page == "home") {
      this.router.navigate(['/']);
    }
  }
}
