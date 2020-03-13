import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'personal-search',
  templateUrl: './personal-search.component.html',
  styleUrls: ['./personal-search.component.scss']
})

export class PersonalSearchComponent implements OnInit {
  public toon: any;
  public searchTxt;

  constructor(
    private router: Router,
  ) {
  }

  ngOnInit(): void {
  }

  navigate(data) {
    this.router.navigate(['/content'], { queryParams: { id: data.id } });
  }

  onSubmit() {
  }

}
