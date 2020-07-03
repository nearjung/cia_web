import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss']
})
export class VehicleComponent implements OnInit {
  public searchTxt: string;
  public catagory: string = '0';

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit() {

  }

}
