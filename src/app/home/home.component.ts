import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public isLoading: boolean = false;
  public isDesktop;

  public user = JSON.parse(localStorage.getItem("userData"));

  constructor(
    private deviceService: DeviceDetectorService,
    private router: Router
  ) {

    if (!this.user) {
      this.router.navigate(['/login']);
      //location.reload();
      return;
    }

  }

  ngOnInit(): void {
    this.isDesktop = this.deviceService.isDesktop();
  }

}
