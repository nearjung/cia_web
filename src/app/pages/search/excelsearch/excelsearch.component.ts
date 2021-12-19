import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleService } from '../../../service/vehicle.service';
import { MemberService } from '../../../service/member.service';
import { NgxCsvParser } from 'ngx-csv-parser';
import { NgxCSVParserError } from 'ngx-csv-parser';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ToolService } from '../../../service/tool.service';
import Swal from 'sweetalert2'
import { BatchService } from '../../../service/batch.service';
import { DownloadFileService } from '../../../service/download.service';

@Component({
  selector: 'app-excelsearch',
  templateUrl: './excelsearch.component.html',
  styleUrls: ['./excelsearch.component.scss']
})
export class ExcelSearchComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  public user: any = JSON.parse(localStorage.getItem("userData"));
  public pages: string = "idcard";
  public upload: boolean = false;
  public fileName: string;
  public creditData: any;

  public csvRecords: any[] = [];
  public header = false;
  public activeMenuList = [];
  public menuActive = {
    batchId: null,
    batchPerson: null,
    batchPhone: null
  }

  public sendList = {
    mode: '',
    obj: '',
  }

  constructor(
    private toast: ToastrService,
    private router: Router,
    private MemberService: MemberService,
    private VehicleService: VehicleService,
    private toolService: ToolService,
    private route: ActivatedRoute,
    private ngxCsvParser: NgxCsvParser,
    private batchService: BatchService,
    private downloadService: DownloadFileService,

  ) {
    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }

  }

  ngOnInit(): void {
    this.creditList(0);

    if (this.user.authority != 'Admin') {
      this.MemberService.getActiveMenu(this.user.member_id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        if (result.serviceResult.status == "Success") {
          this.activeMenuList = result.serviceResult.value;
          this.menuActive.batchId = (this.activeMenuList.filter(x => x['menuId'] == '8').length > 0) ? true : false;
          this.menuActive.batchPerson = (this.activeMenuList.filter(x => x['menuId'] == '9').length > 0) ? true : false;
          this.menuActive.batchPhone = (this.activeMenuList.filter(x => x['menuId'] == '10').length > 0) ? true : false;
        }
      })
    }
  }

  creditList(id) {
    this.MemberService.getMenuList().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status == "Success") {
        this.creditData = result.serviceResult.value[id];
      }
    })
  }

  fileChangeListener(event: any) {
    const files = event.srcElement.files;
    this.ngxCsvParser.parse(files[0], { header: this.header, delimiter: ',' }).pipe().subscribe((result: Array<any>) => {
      result.splice(0, 1)
      this.csvRecords = result;
      this.loading(true);

      this.sendList.mode = this.pages;
      this.sendList.obj = "";
      if (this.pages == 'idcard') {
        for (let obj of this.csvRecords) {
          this.sendList.obj = this.sendList.obj + "'" + obj[0] + "'" + ',';
        }
      }

      if (this.pages == 'person') {
        for (let obj of this.csvRecords) {
          this.sendList.obj = this.sendList.obj + "'" + obj[0] + obj[1] + "'" + ',';
        }
      }

      if (this.pages == 'phone') {
        for (let obj of this.csvRecords) {
          this.sendList.obj = this.sendList.obj + "'" + obj[0] + "'" + ',';
        }
      }

      this.sendList.obj = this.sendList.obj.slice(0, -1);
      this.sendList.obj = this.sendList.obj.replace(/"/g, '');

      this.batchService.searchBatch(this.sendList).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        if (result.serviceResult.status == "Success") {
          this.upload = true;
          this.loading(false);
          var dataLength = result.serviceResult.value.length;
          var information = result.serviceResult.value;
          for (let info of information) {
            info.MobilePhone = (info.MobilePhone) ? "'" + info.MobilePhone + "'" : null;
            info.HomePhone = (info.HomePhone) ? "'" + info.HomePhone + "'" : null;
            info.IDCARD = (info.IDCARD) ? "'" + info.IDCARD + "'" : null;
          }

          Swal.fire({
            icon: 'success',
            title: 'พบข้อมูล : ' + dataLength.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            html: 'รวมทั้งสิ้น : ' + (this.creditData.menuPrice * dataLength).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' เครดิต<br>คุณต้องการดาวโหลดไฟล์หรือไม่ ?',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#2dbf00',
            cancelButtonColor: '#ff0000'
          }).then(confirm => {
            if (confirm.isConfirmed) {
              this.loading(true);
              var price = this.creditData.menuPrice * dataLength;
              this.MemberService.checkPoint(this.user.member_id, this.user.password, price).subscribe(result => {
                if (result.serviceResult.status == "Success") {
                  // Reduce Credit
                  this.MemberService.addCredit(this.user.email, price, 'reduce').subscribe(async result => {
                    if (result.serviceResult.status == "Success") {
                      this.loading(false);
                      this.downloadService.downloadFile(information);
                    }
                  })
                }
              })
            }
          })
        }
      }, err => {
        this.toast.error(err);
        this.loading(false);
      })

    }, (error: NgxCSVParserError) => {
      console.log('Error', error);
    });
  }

  downloadTemplate() {
    if (this.pages == 'idcard') {
      window.open('./assets/template/IDCard-template.csv', '_blank');
    } else if (this.pages == 'person') {
      window.open('./assets/template/person-template.csv', '_blank');
    } else if (this.pages == 'phone') {
      window.open('./assets/template/phone-template.csv', '_blank');
    }
  }


  loading(show) {
    if (show) {
      eval("$('#hm-loading-box').show();");
    } else {
      eval("$('#hm-loading-box').fadeOut();");
    }
  }

}
