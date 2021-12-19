import { Component, HostListener, OnInit } from '@angular/core';
import { PersonalService } from '../../../service/personal.service';
import { VehicleService } from '../../../service/vehicle.service';
import Swal from 'sweetalert2'
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { MemberService } from '../../../service/member.service';
import { ToolService } from '../../../service/tool.service';
import { SharedService } from '../../../service/shared.service';
@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  public searchTxt: string;
  public firstname: string = '';
  public lastname: string = '';
  public isLoading: boolean = false;
  public dataList = [];
  public user: any = JSON.parse(localStorage.getItem("userData"));
  public year = new Date().getFullYear();
  public dataTbl: boolean = false;
  public dataTblVehicle: boolean = false;
  public personInfo = [];
  public contact = [];
  public workplace = [];
  public provinceList = [];
  public province: string = '';
  public vehicle = [];
  public showData: boolean = false;
  public idCard: string;
  public isShowList: boolean = false;
  public creditData: any;
  public media: any = [];
  public personImage: any;
  public totalCredit: Number;
  public logMasterId: Number;

  constructor(
    private PersonalService: PersonalService,
    private toast: ToastrService,
    private router: Router,
    private VehicleService: VehicleService,
    private MemberService: MemberService,
    private toolService: ToolService,
    private route: ActivatedRoute,
    private sharedService: SharedService
  ) {
    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }

    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
      if (params['idCard']) {
        this.userInfo(params['idCard']);
      }

      if (params['logMasterId']) {
        this.logMasterId = params['logMasterId'];
        this.getListFromLog(params['logMasterId']);
      }
    });

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    window.removeEventListener('scroll', this.scroll, true);
  }

  ngOnInit(): void {
    this.loading(false);
    this.creditList();
    this.loadProvinces();

    window.addEventListener('scroll', this.scroll, true); //third parameter
  }

  scroll = (event: any): void => {
    const number = event.srcElement.scrollTop;
    const maxHeight = event.srcElement.scrollHeight;
    // console.log(event);
    // console.log('I am scrolling ' + number);

    if(maxHeight === number) {
      console.log("Buttom");
    }
  };

  
  bottomReached(): boolean {
    return (window.innerHeight + window.scrollY) >= document.body.offsetHeight;
  }


  loadProvinces() {
    this.toolService.getProvinces().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status == "Success") {
        this.provinceList = result.serviceResult.value;
      }
    })
  }

  creditList() {
    this.MemberService.getMenuList().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status == "Success") {
        this.creditData = result.serviceResult.value[0];
      }
    })
  }

  onInfo(IDCard: string) {
    this.router.navigate(['personal'], { queryParams: { idCard: IDCard } });
  }

  getListFromLog(logMasterId: string) {
    this.dataList = [];
    this.dataTbl = false;
    this.dataTblVehicle = false;
    this.showData = true;
    this.isShowList = false;
    this.loading(true);
    this.MemberService.getLogById(this.user.member_id, logMasterId, this.user.authority).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status == "Success") {
        var value = result.serviceResult.value;
        for (let obj of value) {
          var jsonData = JSON.parse(obj.data);
          this.dataList.push(jsonData);
        }
        this.isShowList = true;
      }
      this.loading(false);
    });
  }

  async onSubmit() {
    this.dataList = [];
    this.dataTbl = false;
    this.dataTblVehicle = false;
    this.showData = true;
    this.isShowList = false;
    this.loading(true);
    if (!this.searchTxt) {
      Swal.fire(
        'Error !',
        'กรุณากรอกชื่อหรือรหัสบัตรประชาชน',
        'error'
      );
      this.loading(false);
      return;
    }
    if (!+this.searchTxt) {
      this.firstname = this.searchTxt.split(' ')[0];
      this.lastname = this.searchTxt.split(' ')[1];
    } else {
      this.firstname = this.searchTxt;
      this.lastname = undefined;
    }
    this.PersonalService.getPersonal(this.searchTxt, this.user.member_id, this.user.password, "Normal", this.province).pipe(takeUntil(this.ngUnsubscribe)).subscribe(async result => {
      if (result.serviceResult.status == "Success") {
        if (result.serviceResult.value) {
          this.loading(false);
          var valueData = result.serviceResult.value;
          var price = this.creditData.menuPrice * valueData.length;
          if (+valueData.length > 0) {
            this.totalCredit = +valueData.length;
            Swal.fire({
              icon: 'success',
              title: 'พบข้อมูล : ' + valueData.length.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              text: 'รวมทั้งสิ้น : ' + (this.creditData.menuPrice * valueData.length).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' เครดิต',
              showConfirmButton: true,
              showCancelButton: true,
              confirmButtonText: 'ยืนยัน',
              cancelButtonText: 'ยกเลิก',
              confirmButtonColor: '#2dbf00',
              cancelButtonColor: '#ff0000'
            }).then(result => {
              if (result.isConfirmed) {
                this.isShowList = true;
                this.loading(true);
                this.MemberService.checkPoint(this.user.member_id, this.user.password, price).subscribe(result => {
                  if (result.serviceResult.status == "Success") {
                    // Reduce Credit
                    this.MemberService.addCredit(this.user.email, price, 'reduce').subscribe(async result => {
                      if (result.serviceResult.status == "Success") {
                        this.dataList = valueData;

                        var count = 0;

                        var postData = {
                          memberId: this.user.member_id,
                          password: this.user.password,
                          obj: this.dataList
                        };

                        this.PersonalService.getPersonalInfo(postData).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
                          if (result.serviceResult.status == "Success") {
                            var dataSend: any = {};
                            dataSend.dataMaster = {
                              memberId: this.user.member_id,
                              keySearch: this.searchTxt,
                              module: "Personal"
                            };
                            dataSend.dataSub = this.dataList;
                            // SendLog  
                            this.MemberService.sendLog(dataSend).subscribe(result => {
                            }, err => {
                              console.log("Error: " + err);
                            });

                            // Update Credit
                            this.sharedService.sendClickEvent();
                          }
                        })


                        // for (let data of this.dataList) {
                        //   this.PersonalService.getPersonalInfo(data.IDCard, this.user.member_id, this.user.password).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
                        //     if (result.serviceResult.status == "Success") {
                        //       data.personInfo = result.serviceResult.value;
                        //       count++;
                        //     }

                        //     if (count == this.dataList.length) {
                        //       var dataSend: any = {};
                        //       dataSend.dataMaster = {
                        //         memberId: this.user.member_id,
                        //         keySearch: this.searchTxt,
                        //         module: "Personal"
                        //       };
                        //       dataSend.dataSub = this.dataList;
                        //       // SendLog  
                        //       this.MemberService.sendLog(dataSend).subscribe(result => {
                        //       }, err => {
                        //         console.log("Error: " + err);
                        //       });

                        //     }
                        //   })
                        // }


                      }
                    }, err => {
                      console.log(err);
                    });
                  } else {
                    Swal.fire(
                      'Error !',
                      'จำนวน Credit ไม่เพียงพอ',
                      'error'
                    )
                  }
                }, err => {
                  console.log(err);
                });
                this.loading(false);
              }
            });
          } else {
            Swal.fire(
              'Error !',
              'ไม่พบข้อมูล',
              'error'
            );
            this.loading(false);
          }
        } else {
          this.toast.error("ไม่พบข้อมูลในระบบ !");
          this.loading(false);
        }
      } else {
        Swal.fire(
          'Error !',
          result.serviceResult.text,
          'error'
        );
        this.loading(false);
      }
    }, err => {
      this.toast.error(err);
      this.loading(false);
    })

  }

  vehicleInfo(plate1: string, plate2: string, numbody: string = '', numengine: string = '', mode: string = 'car') {
    this.dataTbl = true;
    this.dataTblVehicle = true;
    this.showData = false;
    this.personInfo = [];
    this.contact = [];
    this.workplace = [];
    this.searchTxt = '';
    this.VehicleService.getVehicleInfo(this.user.member_id, this.user.password, plate1, plate2, numbody, numengine, mode).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.serviceResult.status == "Success") {
        this.vehicle = result.serviceResult.value;
      } else {
        this.toast.error("เกิดข้อผิดพลาดขณะรันข้อมูล !");
      }
    }, err => {
      this.toast.error(err);
    })
  }

  userInfo(idCard: string) {
    this.idCard = idCard;
    this.dataTbl = true;
    this.showData = true;
    this.personInfo = [];
    this.contact = [];
    this.workplace = [];
    // if (this.logMasterId) {
    //   this.personInfo = this.dataList.filter(x => x['IDCard'] == idCard)[0].personInfo;
    //   if (this.personInfo['ImageData']) {
    //     this.personImage = this.hexToBase64(this.personInfo['ImageData']).replace("ANj/", "/9j/");
    //   }
    // } else {
      this.PersonalService.getPersonalInfoSingle(idCard, this.user.member_id, this.user.password).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        if (result.serviceResult.status == "Success") {
          this.personInfo = result.serviceResult.value;
          // this.hexToBase64()
          this.personImage = this.hexToBase64(result.serviceResult.value.ImageData).replace("ANj/", "/9j/");
        }
      }, err => {
        this.toast.error(err);
      });
    // }
  }

  loading(show) {
    if (show) {
      eval("$('#hm-loading-box').show();");
    } else {
      eval("$('#hm-loading-box').fadeOut();");
    }
  }

  hexToBase64(str) {
    return btoa(String.fromCharCode.apply(null,
      str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))
    );
  }

  back(mode) {
    if (mode == 1) {
      this.dataTbl = false;
      this.showData = false;
    } else if (mode == 2) {
      this.dataTblVehicle = false;
      this.userInfo(this.idCard);
    }
  }


}
