import { Component, OnInit } from '@angular/core';
import { MemberService } from '../../../service/member.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DownloadFileService } from '../../../service/download.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [DownloadFileService]
})
export class ProfileComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  public profile: boolean = true;
  public test;
  public test2;
  public user = JSON.parse(localStorage.getItem("userData"));

  constructor(
    private MemberService: MemberService
    , private downloadService: DownloadFileService,
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  downloadLog() {
    this.MemberService.getlogMember(this.user.member_id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status == "Success") {
        return this.downloadService.downloadFile(result.serviceResult.value);
      }
    })
  }
}
