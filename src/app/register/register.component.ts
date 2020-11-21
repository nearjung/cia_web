import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MemberService } from '../service/member.service';
import { ConfigServerService } from '../core/config-server.service';
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public isLoading: boolean = false;
  public isDesktop;

  public user = JSON.parse(localStorage.getItem("userData"));

  // Field
  public email: string;
  public pass1: string;
  public pass2: string;
  public titleName: string;
  public fullName: string;
  public idCard: string;
  public telephone: string;

  constructor(
    private deviceService: DeviceDetectorService,
    private router: Router,
    private toast: ToastrService,
    private memberService: MemberService,
    private configService: ConfigServerService
  ) {

  }

  ngOnInit(): void {
    this.isDesktop = this.deviceService.isDesktop();
  }

  submit() {
    this.loading(true);
    if (!this.idCard || !this.email || !this.titleName || !this.fullName || !this.telephone) {
      this.toast.error("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      this.loading(false);
    } else if (this.pass1 != this.pass2) {
      this.toast.error("รหัสผ่านไม่ตรงกัน");
      this.loading(false);
    } else {
      var token = uuidv4();
      this.memberService.register(this.email, this.pass2, this.titleName, this.fullName, this.idCard, this.telephone, token).subscribe(result => {
        if (result.serviceResult.status == "Success") {
          // Send Mail
          var content = ''
          content += " <div style='font-size: 20px; color: red;'>Welcome : " + this.titleName + this.fullName + "</div><br>";
          content += " <br>";
          content += " <a href='"+ this.configService.getAPI('pages/access.php?token='+ token +'') +"'><< Click Here >></a> to active your email address. if you can not click this link please copy this link to your browser.<br>";
          content += " <br>";
          content += " <br>";
          content += " We are profession in consumer database, we integrate data and create supreme ‘asset’ which undeniably be needed by every business enterprises. We walk aside so… your offerings either physically or digitally deliver into customers 5 senses of perception.";
          content += " <br><br>TAGLINE PRECISE SEGMENT AND TARGETING TO FLOURICH YOUR ENTERPRISE PROFITABILITY";
          content += " CRAFT THE PRECISE SEGMENT, DELIVER TO THE RIGHT TARGET, STRENGTHEN YOUR POSITIONING.  POWERFUL DATABASE BOOST UP YOUR BUSINESS PROFITABILITY";
          content += " <br><br>";
          content += " Our Professional Services <br>";
          content += " <br>";
          content += " Marketing Lead Information<br>";
          content += " - List of Potential Customer<br>";
          content += " - Customer Behavior based on our R&D<br>";
          content += " <br>";
          content += " Data Analyst <br>";
          content += " - Translate your DATA into Information<br>";
          content += " - Complete 'missing piece' of your CUSTOMER<br>";
          content += " <hr>";
          content += " We are persistently believing that our World is disrupted and transforming minute by minute, from production base to marketing oriented, now we are entering the detached and touchless society which is propelling by the information and wisdom derived from BIG DATA analytics. We believe that we are a part in this evolution era.";
          content += " <br>";
          content += " we change Data to Information and Knowledge to convert Potential to Your Customer";
          content += " <hr>";
          content += " tongchan@cia.co.th, tanarat@cia.co.th<br>";
          content += " +66 (2) 1921511<br>";
          content += " www.cia.co.th<br>";
          content += " Direct Mobile : maieak+66 86 448 5324, tanarat +66 91 112 4444<br>";
          content += " X,Y: 13.722223, 100.508684<br>";
          content += " ";
          this.memberService.sendMail(this.email, 'CIA Register information.', content).subscribe(result => {
            if (result.serviceResult.status == "Success") {
              this.toast.success("ลงทะเบียนสำเร็จ");
              this.loading(false);
              this.router.navigate(['/login']);
            } else {
              this.toast.error(result.serviceResult.text);
              this.loading(false);
            }
          }, err => {
            console.log(err)
          })

        } else {
          this.toast.error(result.serviceResult.text);
          this.loading(false);
        }
      }, err => {
        console.log(err);
        this.loading(false);
      })
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
