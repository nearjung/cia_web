import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'loading',
  templateUrl: './loading.component.html'
})
export class LoadingComponent implements OnInit {
  @Input() enable: boolean;

  constructor() { }

  ngOnInit(): void {
    this.showLoading();
  }

  showLoading() {
    if (this.enable) {
      eval("$('#hm-loading-box').show();");
    } else {
      eval("$('#hm-loading-box').fadeOut();");
    }
  }

}
