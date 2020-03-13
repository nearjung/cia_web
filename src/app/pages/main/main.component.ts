import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit {
  public toon: any;

  constructor(
    private router: Router,
  ) {
  }

  ngOnInit(): void {
  }

  getAnimeList () {
    // Count

  }

  navigate(data) {
    this.router.navigate(['/content'], { queryParams: { id: data.id } });
  }

}
