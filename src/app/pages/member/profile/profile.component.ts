import { Component, OnInit } from '@angular/core';
import * as format from 'string-format';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public profile: boolean = true;
  public test;
  public test2;
  constructor() { }

  ngOnInit(): void {
    const bobby = { firstName: 'Bobby', lastName: 'Fischer' }
    const garry = { firstName: 'Garry', lastName: 'Kasparov' }
    this.test = format('{0.firstName} {0.lastName} vs. {1.firstName} {1.lastName}', bobby, garry);
    this.test2 = format('{0}, you have {1} unread message{2}', 'Steve', '1');
  }

  downloadLog() {

  }
}
