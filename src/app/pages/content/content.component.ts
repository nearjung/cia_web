import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
} 

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})

export class ContentComponent implements OnInit {
  public toon: any = [];
  public toonList: any = [];
  public animeId;
  public animeData: any;
  public testText:string = 'testText';

  constructor(
    private router: Router
    , private routerActive: ActivatedRoute
  ) { 
    this.routerActive.queryParams.subscribe(params => {
      this.animeId = params['id'];
    });

    this.toon = [
      {
        'pic': './assets/images/toon/1.jpg',
        'text': 'No Guns Life โนกันส์ไลฟ์ ตอนที่ 1-6 ซับไทย', 
        'id': '1',
        'summary' : 'โดยเรื่องราวนั้นจะเกิดขึ้นในช่วงหลังสงคราม มนุษย์ผู้ถูกดัดแปลงร่างกายบางส่วนให้กลายเป็นอาวุธถูกเรียกว่า “เอ็กซ์เท็นด์" พวกเขาเหล่านี้ถูกบีบให้มาอาศัยในเมืองที่มีบริษัทค้าอาวุธอย่าง "เบริวเลน" เป็นศูนย์กลาง "อินุอิ จูโซ" เอ็กซ์เท็นด์ที่มีหัวเป็นปืนลูกโม่ ได้ตั้งตัวเป็นนักจัดการที่รับจ้างแก้ปัญหาเกี่ยวกับเอ็กซ์เท็นด์ ทว่าวันนึงกลับมีเอ็กซ์เท็นด์ลึกลับมาขอร้องให้จูโซช่วยปกป้องเด็กชายคนนึงไว้ และจูโซได้รับไว้โดยไม่รู้ตัวเลยว่าเด็กชายคนนี้ได้กุมอาวุธสำคัญของเบริวเลนเอาไว้...'
      },
      {'pic': './assets/images/toon/2.jpg','text': 'Fate Grand Order: Zettai Majuu Sensen Babylonia ตอนที่ 0-18 ซับไทย', 'id': '2', 'summary': ''},
      {'pic': './assets/images/toon/3.jpg','text': '22/7 Nanabun no Nijuuni ตอนที่ 1-7 ซับไทย', 'id': '3', 'summary': ''},
      {'pic': './assets/images/toon/4.jpg','text': 'My Hero Academia Season 4 (ภาค4) ตอนที่ 1-19 ซับไทย', 'id': '4', 'summary': ''},
      {'pic': './assets/images/toon/5.jpg','text': 'Haikyuu!! To the Top ไฮคิว!! คู่ตบฟ้าประทาน (ภาค4) ตอนที่ 1-7 ซับไทย', 'id': '5', 'summary': ''},
      {'pic': './assets/images/toon/6.jpg','text': 'Koisuru Asteroid ตอนที่ 1-7 ซับไทย', 'id': '6', 'summary': ''},
      {'pic': './assets/images/toon/7.jpg','text': 'Isekai Quartet 2 (ภาค2) ตอนที่ 1-5 ซับไทย', 'id': '7', 'summary': ''},
      {'pic': './assets/images/toon/8.jpg','text': 'Darwins Game ตอนที่ 1-7 ซับไทย', 'id': '8', 'summary': ''},
    ]

    this.toonList = [
      {
        'id': '1',
        'text': 'No Guns Life โนกันส์ไลฟ์', 
        'type': 'ซับไทย',
        'ep': '1',
        'pic': './assets/images/toon/1.jpg',
        'link': 'https://www.anime-sugoi.com/player0/147387',
      },
      {
        'id': '1',
        'text': 'No Guns Life โนกันส์ไลฟ์', 
        'type': 'ซับไทย',
        'ep': '2',
        'pic': './assets/images/toon/1.jpg',
        'link': 'https://www.anime-sugoi.com/player0/148788',
      },
      {
        'id': '1',
        'text': 'No Guns Life โนกันส์ไลฟ์', 
        'type': 'ซับไทย',
        'ep': '3',
        'pic': './assets/images/toon/1.jpg',
        'link': 'https://www.anime-sugoi.com/player0/156039',
      },
      {
        'id': '1',
        'text': 'No Guns Life โนกันส์ไลฟ์', 
        'type': 'ซับไทย',
        'ep': '4',
        'pic': './assets/images/toon/1.jpg',
        'link': 'https://www.anime-sugoi.com/player0/147387',
      },
      {
        'id': '1',
        'text': 'No Guns Life โนกันส์ไลฟ์', 
        'type': 'ซับไทย',
        'ep': '5',
        'pic': './assets/images/toon/1.jpg',
        'link': 'https://www.anime-sugoi.com/player0/147387',
      },
      {
        'id': '1',
        'text': 'No Guns Life โนกันส์ไลฟ์', 
        'type': 'ซับไทย',
        'ep': '6',
        'pic': './assets/images/toon/1.jpg',
        'link': 'https://www.anime-sugoi.com/player0/147387',
      },
    ]

  }

  ngOnInit(): void {
    var data = this.toon.filter(x => x["id"] == this.animeId);
    var epLength = this.toonList.length;
    if (data.length > 0) {
      this.animeData = data[0];
      this.animeData.select = this.toonList[(epLength - 1)]

      
    }
  }

  episode(data) {
    this.animeData.select = data;
  }

}
